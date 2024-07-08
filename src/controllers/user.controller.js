const UserModel = require("../models/user.model.js");
const passport = require("passport");
const UserDTO = require("../dto/user.dto.js");
const { generatedResetToken } = require("../utils/tokenreset.js");
const { de_AT } = require("@faker-js/faker");
const EmailManager = require("../services/email.js");
const { isValidPassword, createHash } = require("../utils/hashbcryp.js");
const emailManager = new EmailManager();
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();
const nodemailer = require('nodemailer');

class UserController {
    async register (request, response) {
        const {first_name, last_name, email, password, age} = request.body;

    try{
        response.redirect("/products");
    } catch (error){
        console.log("Error creating the user: ", error);
        response.status(500).send({error: "Error saving the new user"});
    }
    }

    async profile(request, response){
        const userDTO = new UserDTO(request.user.first_name, request.user.last_name, request.user.role);
        const isAdmin = request.user.role === "admin";
        response.render("profile", {user: userDTO, isAdmin});
    }

    async admin(request, response) {
        if (request.user.user.role !== "admin") {
            return response.status(403).send("Denied Access");
        }
        response.render("admin");
    }

    async requestPasswordReset(request, response) {
        const {email} = request.body;

        try {
            const user = await UserModel.findOne({email});      
            if(!user){
                return response.status(404).send("User Not Found");
            }

            const token = generatedResetToken();

            user.resetToken = {
                token: token,
                expire: new Date(Date.now() + 3600000)
            }

            await user.save()

            await emailManager.sendResetEmail(email, user.first_name, token);

            response.redirect("confirmationsend")

        } catch (error) {
            response.status(500).send("Internal server error");
        }
    }

    async resetPassword (request,response){
        const {email, password, token} = request.body;

        try {
            const user = await UserModel.findOne({email});          
            if(!user){
                return response.render("passwordchange", {error: "User Not Found"});
            }

            const resetToken = user.resetToken;
            if(!resetToken || resetToken.token !== token){
                return response.render("passwordreset", {error: "The token for reset the password is invalid"});
            }

            const now = new Date();
            if(now > resetToken.expire){
                return response.render("passwordreset", {error: "The token for reset the password is invalid"});
            }

            if(isValidPassword(password, user)){
                return response.render("passwordchange", {error: "The new password couldn't be the same that the last one"});
            }

            user.password = createHash(password);

            user.resetToken = undefined;
            await user.save();

            return response.redirect("/login");
        } catch (error) {
            response.status(500).send("passwordreset", {error: "Internal server error"});
        }
    }

    async changeRolPremium (request,response){
        const {uid} = request.params;

        try {
            const user = await UserModel.findById(uid);
            if(!user){
                return response.status(404).send("User Not Found");
            }

            const requiredDocument = ["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"];
            const userDocuments = user.documents.map(doc => doc.name);
            const haveDocumentention = requiredDocument.every(doc => userDocuments.includes(doc));

            if(!haveDocumentention){
                return response.status(400).send("The user have to completed all the required documentation");
            }

            const newRole = user.role === "usuario" ? "premium" : "usuario";
            const update = await UserModel.findByIdAndUpdate(uid, {role: newRole});

            response.json(update);
        } catch (error) {
            response.status(500).send("Internal server error");
        }
    }

    async login (request,response){
        const { email, password } = req.body;

        try {
            const userFound = await userRepository.findByEmail(email);

            if (!userFound) {
                return response.status(401).send("Invalid user");
            }

            const isValid = isValidPassword(password, userFound);
            if (!isValid) {
                return response.status(401).send("Incorrect password");
            }

            const token = jwt.sign({ user: userFound }, "coderhouse", {
                expiresIn: "1h"
            });

            userFound.last_connection = new Date();
            await userFound.save();

            response.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            response.redirect("/api/users/profile");
        } catch (error) {
            console.error(error);
            response.status(500).send("Internal server error");
        }
    }

    async logout (request,response){
        if(request.user){
            try {
                request.user.last_connection = new Date();
                await request.user.save();

            } catch (error) {
                console.error(error);
                response.status(500).send("Internal server error");
                return;
            }
        }

        response.clearCookie("coderCookieToken");
        response.redirect("/login");
    }

    async getAllUsers(request, response) {
        try {
            const users = await UserModel.find({}, 'first_name last_name email role');
            response.json(users);
        } catch (error) {
            response.status(500).send("Internal server error");
        }
    }

    async deleteInactiveUsers(request, response) {
        try {
            const thresholdDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); 
            const usersToDelete = await UserModel.find({ last_connection: { $lt: thresholdDate } });
    
            usersToDelete.forEach(user => {
                emailManager.sendDeletionEmail(user.email, user.first_name);
            });
    
            await UserModel.deleteMany({ last_connection: { $lt: thresholdDate } });
            response.json({ message: "Usuarios inactivos eliminados" });
        } catch (error) {
            response.status(500).send("Internal server error");
        }
    }

    async updateUserRole(request, response) {
        const { id } = request.params;
        const { role } = request.body;
    
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return response.status(404).send("User Not Found");
            }
            user.role = role;
            await user.save();
            response.json({ message: "Role updated successfully" });
        } catch (error) {
            response.status(500).send("Internal server error");
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;

        try {
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).send("User not found");
            }

            await user.remove();
            res.json({ message: "User deleted" });
        } catch (error) {
            console.error("Error deleting user", error);
            res.status(500).json({ error: "Server error" });
        }
    }

    async sendDeletionEmail(email) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'tu-email@gmail.com',
                pass: 'tu-contraseña'
            }
        });

        const mailOptions = {
            from: 'tu-email@gmail.com',
            to: email,
            subject: 'Cuenta eliminada por inactividad',
            text: 'Tu cuenta ha sido eliminada debido a inactividad en los últimos 2 días.'
        };

        return transporter.sendMail(mailOptions);
    }
}

module.exports = UserController;