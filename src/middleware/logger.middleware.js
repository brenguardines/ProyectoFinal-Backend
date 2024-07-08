const logger = require("../utils/logger.js");

const addLogger = (request, response, next) => {
    request.logger = logger;
    request.logger.http(`${request.method} in ${request.url} - ${new Date().toLocaleTimeString()}`);
    next();
}

module.exports = addLogger;