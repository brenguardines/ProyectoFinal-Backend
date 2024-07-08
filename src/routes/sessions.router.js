const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcryp.js");
const passport = require("passport");
const isAuthenticated = require("../middleware/authenticate.middleware.js");



router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (request, response) => {
    const {email, password} = request.body;
    if(email == "adminCoder@coder.com" && password == "adminCoder123"){
        request.session.login = true;
        request.session.user = {
            email: email,
            password: password,
            first_name: "admin",
            last_name: "coder",
            age: 22,
            role: "admin"
        };
        response.redirect("/products");
    }else{
        try{
            const user = await UserModel.findOne({email: email});
            if(user){
                if(isValidPassword(password,user)){
                    request.session.login = true;
                    request.session.user = {...user._doc};
    
                    response.redirect("/products");
                }else{
                    response.status(401).send({error: "Invalid password"});
                }
            }else{
                response.status(404).send({error: "User not found"});
            }
        } catch(error){
            response.status(404).send({error: "Error in login"});
        }
    }
    
})

router.get("/faillogin", async (request, response) => {
    response.send({error: "Failed login"});
})

router.get("/logout", (request, response) => {
    if(request.session.login){
        request.session.destroy();
    }
    response.redirect("/login");
})

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (request, response) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (request, response) => {
    request.session.user = request.user;
    request.session.login = true;
    response.redirect("/products");
})

router.get("/current", passport.authenticate("current", {failureRedirect: "/api/sessions/faillogin"}), (request, response) => {
    if(request.isAuthenticated()){
        response.json(request.user);
    }else{
        response.status(401).json({error:"User not authenticated"});
    }
    
})

module.exports = router;