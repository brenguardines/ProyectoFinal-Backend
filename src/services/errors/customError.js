class CustomError {
    static createError({name = "Error", cause = "Stranger", message, code = 1}){
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;

        throw error; 
    }
}

module.exports = CustomError;