const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const ProductoRepository = require("../repositories/product.repository.js");
const productoRepository = new ProductoRepository;
const UserModel = require("../models/user.model.js");
const TicketModel = require("../models/ticket.model.js");


class CartController {
    async newCart(request, response) {
        try{
            const newCart = await cartRepository.addCart();
            response.json(newCart);
        }catch (error){
            console.log("Error add a new cart", error);
            response.status(500).json({error: "Server error"});
        }
    };
    
    async getCart(request, response) {
        const cartId = request.params.cid;
    
        try{
            const cart = await cartRepository.getCartById(cartId);
            response.json(cart.products);
        }catch (error){
            console.log("Error getting cart", error);
            response.status(500).json({error: "Server error"});
        }
    };
    
    async addProductToCart(request, response) {
        const cartId = request.params.cid;
        const productId = request.params.pid;
        const quantity = request.body.quantity || 1;
    
        try{
            const product = await productoRepository.getProductById(productId);
            if(!product){
                return response.status(404).json({message: 'Product Not Found'});
            }

            if(request.user.role === 'premium' && product.owner === request.user.email){
                return response.status(404).json({message: 'You couldn´t add an own product'});
            }

            await cartRepository.addProductToCart(cartId, productId, quantity);
            const cartID = (request.user.cart).toString();

            response.redirect(`/carts/${cartID}`)
        }catch (error){
            console.log("Error add product to cart", error);
            response.status(500).json({error: "Server error"});
        }
    };
    
    async deleteProductToCart(request, response) {
        const cartId = request.params.cid;
        const productId = request.params.pid;
    
        try{
            const updateCart = await cartRepository.deleteProductToCart(cartId, productId);
            response.json({
                status: 'success',
                message: 'Product delete at cart successfully',
                updateCart});
        }catch (error){
            console.log("Error deleting product to cart", error);
            response.status(500).json({error: "Server error"});
        }
    };
    
    async updateCart(request, response) {
        const cartId = request.params.cid;
        const updatePorducts = request.body;
    
        try{
            const updateCart = await cartRepository.updateCart(cartId, updatePorducts);
            response.json(updateCart);
        }catch (error){
            console.log("Error updating cart", error);
            response.status(500).json({error: "Server error"});
        }
    };
    
    async updateQuatityProducts(request, response) {
        const cartId = request.params.cid;
        const productId = request.params.pid;
        const newQuantity = request.body.quantity;
    
        try{
            const updateCart = await cartRepository.updateQuatityProducts(cartId, productId, newQuantity);
            response.json({
                status: 'success',
                message: 'Product quantity update successfully',
                updateCart});
        }catch (error){
            console.log("Error updating cart", error);
            response.status(500).json({error: "Server error"});
        }
    };
    
    async emptyCart(request, response) {
        const cartId = request.params.cid;
    
        try{
            const updateCart = await cartRepository.emptyCart(cartId);
            response.json({
                status: 'success',
                message: 'All products at cart were delete successfully',
                updateCart});
        }catch (error){
            console.log("Error deleting product to cart", error);
            response.status(500).json({error: "Server error"});
        }
    };

    async finishBuying(request, response) {
        const cartId = request.params.cid;
    
        try{
            const cart = await cartRepository.getCartById(cartId);
            const products = cart.products;
            const productsNotAvailable = [];

            for(item of products){
                const productId = item.product;
                const product = await productoRepository.getProductById(productId);

                if(product.stock >= item.quantity){
                    product.stock -= item.quantity;
                    await product.save();
                }else{
                    productsNotAvailable.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ email: email });

            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calculateTotal(cart.products),
                purchaser: userWithCart.email
            })
            await ticket.save();

            cart.products = cart.products.filter(item => productsNotAvailable.some(productId => productId.equals(item.product)));
            await cart.save();
            response.status(500).json({productsNotAvailable});
        }catch (error){
            console.log("Error deleting product to cart", error);
            response.status(500).json({error: "Server error"});
        }
    }
}

module.exports = CartController;