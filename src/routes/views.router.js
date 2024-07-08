const express = require("express");
const router = express.Router();
const passport = require("passport");

const ViewController = require("../controllers/view.controller.js");
const isAuthenticated = require("../middleware/authenticate.middleware.js");  

const viewController = new ViewController();

// Ruta inicial, redirige al login
router.get("/", (req, res) => {
    res.redirect("/login");
});

// Ruta para mostrar el formulario de login
router.post("/login", passport.authenticate("login", {
    successRedirect: "http://localhost:3000",  
    failureRedirect: "/login",
}));

// Ruta para procesar el inicio de sesión
router.post("/login", passport.authenticate("login", {
    successRedirect: "/products",  
    failureRedirect: "/login",     
}));

// Otras rutas protegidas que requerirán autenticación
router.get("/products", isAuthenticated, viewController.renderProducts);
router.get("/carts/:cid", isAuthenticated, viewController.renderCart);
router.get("/register", viewController.renderRegister);
router.get("/realtimeproducts", isAuthenticated, viewController.renderRealTimeProducts);
router.get("/chat", isAuthenticated, viewController.renderChat);
router.get("/reset-password", viewController.renderResetPassword);
router.get("/password", isAuthenticated, viewController.renderChangePassword);
router.get("/confirmationsend", isAuthenticated, viewController.renderConfirmation);

module.exports = router;
