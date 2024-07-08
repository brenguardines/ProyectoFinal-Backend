const winston = require("winston");
const { mode } = require("../config/config.js");

const loggerConfig = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

// const loggerDevelopment = winston.createLogger({
//     levels: loggerConfig.levels,
//     transports: [
//         new winston.transports.Console({
//             level: "debug",
//             format: winston.format.combine(
//                 winston.format.colorize({ colors: loggerConfig.colors }), 
//                 winston.format.simple()
//             )
//         })
//     ]
// });

// const loggerProduction = winston.createLogger({
//     levels: loggerConfig.levels,
//     transports: [
//         new winston.transports.Console({
//             level: "info",
//             format: winston.format.simple()
//         }),
//         new winston.transports.File({
//             filename: "./errors.log",
//             level: "error",
//             format: winston.format.simple()
//         })
//     ]
// });

// const logger = mode === "production" ? loggerProduction : loggerDevelopment;


const logger = winston.createLogger({
    levels: loggerConfig.level,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: loggerConfig.colors }),
                winston.format.simple()
            )
        })
    ]
});

module.exports = logger;