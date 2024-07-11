const express = require("express");
const router = express.Router();
const passport = require("passport"); 
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const upload = require("../middleware/multer.js");

router.get("/", userController.getAllUsers);
router.delete("/", userController.deleteInactiveUsers);
router.put("/:id/role", userController.updateUserRole);  
router.delete("/:id", userController.deleteUser);        

router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), userController.register);

router.get("/failedregister", (request, response) => {
    response.send({error: "Failed register"});
})

router.get("/profile", userController.profile);
router.get("/admin", userController.admin);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.put("/premium/:uid", userController.changeRolPremium);

router.post("/:uid/documents", upload.fields([{name: "document"}, {name: "products"}, {name: "profile"}]), async(request, response) => {
    const {uid} = request.params;
    const uploadedDocuments = request.files;

    try {
        const user = await userController.findById(uid);

        if(!user){
            return response.status(404).send("User Not Found");
        }

        if(uploadedDocuments){
            if(uploadedDocuments.document) {
                user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if(uploadedDocuments.products) {
                user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            if(uploadedDocuments.profile) {
                user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })))
            }

            await user.save();

            response.status(200).send("Documents uploaded successfully");
        }
    } catch (error) {
        response.status(500).send("Internal server error");
    }
});

module.exports = router; 
