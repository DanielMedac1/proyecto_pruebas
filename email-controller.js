const nodemailer = require('nodemailer');

async function confirmationMail(receptor, token) {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'josejuanab@gmail.com',
            pass: 'tpjs xlhi wdrh bctq'
        }
    }

    const mensaje = {
        from: 'josejuanab@gmail.com',
        to: receptor,
        subject: "Confirma tu cuenta",
        text: `Confirma tu cuenta aquí: localhost:3005/confirm/${token}`
    }

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail(mensaje);

    console.log(info);
}


module.exports = confirmationMail;