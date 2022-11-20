var nodemailer = require('nodemailer');
module.exports = class Email {
    constructor() {
        this.config = {
            host: 'smtp.163.com',
            port: 25,
            auth: {
                user: 'xxf1234123@163.com', //注册的邮箱账号
                pass: 'BXYBAZPYMUSRPRRT'  //邮箱的授权码，不是注册时的密码
            }
        };
        this.transporter = nodemailer.createTransport(this.config);
    }

    sendEmail(mail) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mail, function (error, info) {
                if (error) {
                    console.log(error)
                    reject(error)
                }
                resolve(true)
            });
        })
    }
}