const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductModel = require("../models/product.model.js");

class ViewController {
    async renderLogin(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect("/products"); 
        }
        res.render("login");
    }

    async renderRegister(req, res) {
        if (req.isAuthenticated()) {
            return res.redirect("/products"); 
        }
        res.render("register");
    }

    async renderProducts(req, res) {
        
        res.render("products");
    }
    /*
    async renderProducts (request, response){
        try{
            const { page = 1, limit = 3 } = request.query;
            const skip = (page - 1) * limit;

            const products = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();
            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
    
            const newArray = products.map(product => {
                const {_id, ...rest} = product.toObject();
                return rest;
            });

            //const cartId = (request.user.cart).toString();
    
            response.render("products", {
                products: newArray,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                //cartId,
                user: request.session.user 
             });
    
        }catch (error){
            console.log("Error getting products", error);
            response.status(500).json({error: "Server error"});
        }
    }
        */

    async renderCart (request, response){
        const cartId = request.params.cid;
    
        try{
            const cart = await cartRepository.getCartById(cartId);
    
          if (!cart) {
             console.log(`Doesn't exists cart with id ${cartId}`);
             return response.status(404).json({ error: "Cart not found" });
          }
    
          const productsInCart = cart.products.map(p => {
             const product =  p.product.toObject();
             const quantity = p.quantity;
             const totalPrince = product.price * quantity;

             total += totalPrince;

             return {
                product: { ...product, totalPrice },
                quantity,
                cartId
            };
          });
    
          response.render("carts", { products: productsInCart , total, cartId});
    
        }catch (error){
            console.log("Error add a new cart", error);
            response.status(500).json({error: "Server error"});
        }
    }

    /*
    async renderLogin (request, response){
        if (request.session.login) {
            return response.redirect("/products");
        }
        response.render("login");
    }

    async renderRegister (request, response){
        if (request.session.login) {
            return response.redirect("/products");
        }
        response.render("register");
    }
        */

    async renderRealTimeProducts (request, response){
        try {
            response.render("realtimeproducts");
        } catch (error) {
            console.log("Error in view real time", error);
            response.status(500).json({error: "Server error"});
        }
    }

    async renderChat (request, response){     
        response.render("chat");
    }

    async renderHome (request, response){
        response.render("home");
    }

    async renderResetPassword (request, response){  
        response.render("passwordreset");
    }

    async renderChangePassword (request, response){  
        response.render("passwordchange");
    }

    async renderConfirmation (request, response){  
        response.render("confirmationsend");
    }

}

module.exports = ViewController;