const mongoose = require("mongoose");
let expect;

before(async function () {
    const chai = await import('chai');
    expect = chai.expect;
})
const Carts = require("../src/repositories/cart.repository.js");

mongoose.connect("mongodb+srv://bguardines:coderhouse@cluster0.iuhkdwd.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0");



describe("Testing about carts: ", function () {
    before(function () {
        this.cartsDao = new Carts();
    });

    beforeEach(async function () {
        await mongoose.connection.collections.carts.drop();
    });

    it("Should create a new cart", async function (done) {
        try {
            const newCart = await this.cartsDao.addCart({products : []});
            expect(newCart).to.have.property("_id");
            expect(newCart.products).to.be.an('array').that.is.empty;
        } catch (error) {
            done(error);
        }
    });

    it("Should get a cart by ID", async function (done) {
        try {
            const newCart = await this.cartsDao.addCart({products: []});
            const cartId = newCart._id;
            const fetchedCart = await this.cartsDao.getCartById(cartId);
            expect(fetchedCart).to.have.property("_id", cartId);
            expect(fetchedCart.products).to.be.an('array').that.is.empty;
        } catch (error) {
            done(error);
        }
    });

    it("Should add a product to a cart", async function (done) {
        try {
            const newCart = await this.cartsDao.addCart({ products: [] });
            const cartId = newCart._id;

            const product = {
                product: new mongoose.Types.ObjectId(),
                quantity: 2
            };

            await this.cartsDao.updateCart(cartId, { $push: { products: product } });

            const updatedCart = await this.cartsDao.getCartById(cartId);
            expect(updatedCart.products).to.be.an('array');
            expect(updatedCart.products[0]).to.have.property('product');
            expect(updatedCart.products[0]).to.have.property('quantity', 2);
        } catch (error) {
            done(error);
        }
    });

    it("Should remove a product from a cart", async function (done) {
        try {
            const productId = new mongoose.Types.ObjectId();
            const newCart = await this.cartsDao.addCart({ products: [{ product: productId, quantity: 2 }] });
            const cartId = newCart._id;

            await this.cartsDao.updateCart(cartId, { $pull: { products: { product: productId } } });

            const updatedCart = await this.cartsDao.getCartById(cartId);
            expect(updatedCart.products).to.be.an('array').that.is.empty;
        } catch (error) {
            done(error);
        }
    });

    it("Should empty a cart", async function (done) {
        try {
            const productId = new mongoose.Types.ObjectId();
            const newCart = await this.cartsDao.addCart({ products: [{ product: productId, quantity: 2 }] });
            const cartId = newCart._id;

            await this.cartsDao.updateCart(cartId, { $set: { products: [] } });

            const emptiedCart = await this.cartsDao.getCartById(cartId);
            expect(emptiedCart.products).to.be.an('array').that.is.empty;
        } catch (error) {
            done(error);
        }
    });

    after(async function () {
        await mongoose.disconnect();
    })
})