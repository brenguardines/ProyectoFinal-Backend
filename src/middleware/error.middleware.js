const { EErros } = require("../services/errors/enums.js");

const manejadorError = (error, request, response, next) => {
    console.log(error.causa);
    switch(error.code){
        case EErros.TIPO_INVALIDO:
            response.send({status: "error", error: error.nombre});
            break;
        default:
            response.send({status: "error", error: "Unknown error"});
    }
}

module.exports = manejadorError;