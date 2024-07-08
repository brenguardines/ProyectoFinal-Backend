const ProductModel = require("../models/product.model.js");

class ProductRepository {

    async addProduct({title, description, price, img, code, stock, category, thumbnails}){
        try{
            if(!title || !description || !price || !code || !stock || !category){
                console.log("All fields are required");
                return;
            }

            const productExists = await ProductModel.findOne({code: code});

            if(productExists){
                console.log("The code is repeated, it must be unique");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
            return newProduct;

        } catch(error){
            console.log("Error add product", error);
            throw error; 
        }
    }

    async getProducts({limit = 10, page = 1, sort, query} = {}){
        try{
            const skip = (page - 1) * limit;

            let queryOptions = {};
            if(query){
                queryOptions = {category: query};
            }

            const sortOptions = {};
            if(sort){
                if(sort === 'asc' || sort === 'desc'){
                    sortOptions.price = sort === 'asc' ? 1 : -1;
                }
            }

            const products = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);
            
            const totalProducts = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPages: hasPrevPage ? page - 1 : null,
                nextPages: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null
            };
        } catch(error){
            console.log("Error getting products", error);
            throw error; 
        }
    }

    async getProductById(id){
        try{
            const product = await ProductModel.findById(id);

            if(product){
                console.error("Product found");
                return product;
            }else{
                console.error("Product not found");
                return null;
            }

        } catch(error){
            console.log("Error getting product by id", error);
            throw error; 
        }
    }

    async updateProduct(id, productUpdate){
        try{
            const updateProduct = await ProductModel.findByIdAndUpdate(id, productUpdate);

            if(updateProduct){
                console.log("Product update successfully");
                return updateProduct;
            }else{
                console.error("Product not found");
                return null;
            }
            
        } catch(error){
            console.log("Error updating product by id", error);
            throw error; 
        }
    }

    async deleteProduct(id){
        try{
            const deleteProduct = await ProductModel.findByIdAndDelete(id);

            if(deleteProduct){
                console.log("Product deleted");
                return deleteProduct;
            }else{
                console.error("Product not found");
                return null;
            }

        } catch(error){
            console.log("Error deleting product by id", error);
            throw error; 
        }
    }
}

module.exports = ProductRepository;