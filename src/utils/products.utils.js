const {faker} = require("@faker-js/faker");

const generatedProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        tittle: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        img: faker.image.avatar(),
        category: faker.commerce.department(),
        stock: parseInt(faker.string.numeric())
    }
}

module.exports = generatedProducts;