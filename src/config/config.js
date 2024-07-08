const dotenv = require("dotenv");
const program = require("../utils/commander.js");
// const {mode} = program.opts();

const mode = program.mode || "development";

dotenv.config({
    path: mode === "development" ? "./.env.development" : "./.env.production"
})

const configObject = {
    puerto: process.env.PUERTO,
    mongo_url: process.env.MONGO_URL,
    mode: mode 
}

module.exports = configObject;