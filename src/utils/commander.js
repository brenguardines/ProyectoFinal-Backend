const {Command} = require("commander");
const program = new Command();


program
    .option("-p <port>", "Server initialize port", 8080)
    .option("--mode <mode>", "Work mode", "production")
program.parse();

module.exports = program;