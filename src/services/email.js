const nodemailer = require("nodemailer");

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "bguardines@gmail.com",
                pass: "hoer lmqe trbv hbes"
            }
        });
    }

    async sendEmailPurchase(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "Bren <bguardines@gmail.com>",
                to: email,
                subject: "Purchase confirmation",
                html: `<h1>Purchase confirmation</h1>
                        <p>Thanks for your purchase, ${first_name}!</p>
                        <p>The ID order is: ${ticket}!</p>`
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }

    async sendResetEmail(email, first_name, token){
        try {
            const mailOptions = {
                from: "Bren <bguardines@gmail.com>",
                to: email,
                subject: "Reset password",
                html: `<h1>Reset password</h1>
                        <p>Hi, ${first_name}!</p>
                        <p>you asked to reset your password, we will send you the confirmation code</p>
                        <strong> ${token} </strong>
                        <p>this code expires in 1 hour</p>
                        <a href="http://localhost:8080/password"> Reset Password </a>`
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            
        }
    }
}

module.exports = EmailManager;