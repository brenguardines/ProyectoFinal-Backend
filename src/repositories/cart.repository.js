const CartModel = require("../models/cart.model.js");

class CartRepository{
    async addCart(){
        try{
            const newCart = new CartModel({products : []});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error add new cart", error);
            throw error;
        }
    }

    async getCartById(cartId){
        try{
            const cart = await CartModel.findById(cartId);

            if(!cart){
                throw new Error (`Doesn't exists cart with id ${cartId}`);
            }

            return cart;

        } catch (error) {
            console.log("Error getting cart by id", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1){
        try{
            const cart = await this.getCartById(cartId);
            const productExists = cart.products.find(p => p.product._id.toString() === productId);

            if(productExists){
                productExists.quantity += quantity;
            }else{
                cart.products.push({product : productId, quantity});
            }

            cart.markModified('products');

            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error add product", error);
            throw error;
        }
    }

    async deleteProductToCart(cartId, productId){
        try{
            const cart = await CartModel.findById(cartId);

            if(!cart){
                throw new Error("Cart not found");
            }

            cart.products = cart.products.filter(p => p.product._id.toString() !== productId);

            await cart.save();
            return cart;
            
        } catch (error) {
            console.error("Error delete product", error);
            throw error;
        }
    }

    async updateCart(cartId, updateProducts){
        try{
            const cart = await CartModel.findById(cartId);

            if(!cart){
                throw new Error("Cart not found");
            }

            cart.products = updateProducts;
            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error update product", error);
            throw error;
        }
    }

    async updateQuatityProducts(cartId, productId, newQuantity){
        try{
            const cart = await CartModel.findById(cartId);

            if(!cart){
                throw new Error("Cart not found");
            }

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

            if(productIndex !== -1){
                cart.products[productIndex].quantity = newQuantity;
                cart.markModified('products');

                await cart.save();
                return cart;
            }else{
                throw new Error("Product not found in the cart");
            }         

        } catch (error) {
            console.error("Error update quantity product", error);
            throw error;
        }
    }

    async emptyCart(cartId){
        try{
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                {products: []},
                {new: true});

            if(!cart){
                throw new Error("Cart not found");
            }

            return cart;
            
        } catch (error) {
            console.error("Error empty cart", error);
            throw error;
        }
    }
}

module.exports = CartRepository;