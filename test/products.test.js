const supertest = require("supertest");
let expect;

before(async function(){
    const chai = await import('chai');
    expect = chai.expect;
})

const requester = supertest("http://localhost:8080");

describe("Testing for the App Web", () => {
    beforeEach(function (){
        this.productId = null;
    })
    describe("Testing about products: ", () => {
        it("This endpoint has to create succesful a product", async function(){
            const newProduct = {
                title: "Iphone 15 Pro",
                description: "Cellphone 15 Pro brand Apple",
                price: 4000,
                code: "13456",
                stock: 100,
                category: "Cellphones",
                status: true,
                owner: "admin"
            }

            const { statusCode, body } = await requester.post("/api/products").send(newProduct);

            expect(statusCode).to.equal(201);
            expect(body.payload).to.have.property("_id");
            this.productId = body.payload._id;
        })

        it("This endpoint has to get all products successfully", async function(){
            const { statusCode, body } = await requester.get("/api/products");

            expect(statusCode).to.equal(200);
            expect(body.payload).to.be.an("array");
        })

        it("This endpoint has to get a product by ID successfully", async function(){
            const { statusCode, body } = await requester.get(`/api/products/${this.productId}`);

            expect(statusCode).to.equal(200);
            expect(body.payload).to.have.property("_id").that.equals(this.productId);        
        })

        it("This endpoint has to update a product successfully", async function(){
            const updateProduct = {
                title: "Iphone 15 Pro Max",
                price: 4500
            }

            const { statusCode, body } = await requester.put(`/api/products/${this.productId}`).send(updateProduct);

            expect(statusCode).to.equal(200);
            expect(body.payload).to.have.property("title").that.equals(updateProduct.title);
            expect(body.payload).to.have.property("price").that.equals(updateProduct.price);
        })

        it("This endpoint has to delete a product successfully", async function(){
            const { statusCode } = await requester.delete(`/api/products/${this.productId}`);

            expect(statusCode).to.equal(200);

            const { statusCode: getStatusCode, body } = await requester.get(`/api/products/${this.productId}`);

            expect(getStatusCode).to.equal(404);
        })

    })
})