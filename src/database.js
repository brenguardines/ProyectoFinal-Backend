const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {mongo_url} = configObject;

mongoose.connect(mongo_url)
    .then(() => console.log("Successful connection"))
    .catch((error) => console.log(error))


// class DataBase {
//     static #instancia; 

//     constructor(){
//         mongoose.connect(mongo_url)
//     };

//     static getInstancia(){
//         if(this.#instancia){
//             console.log("Previous connection");
//             return this.#instancia;
//         }

//         this.#instancia = new DataBase();
//         console.log("Successful connection");
//         return this.#instancia;
//     }
// }

// module.exports = DataBase.getInstancia();