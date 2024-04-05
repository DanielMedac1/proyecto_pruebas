const nodemailer = require('nodemailer');

async function enviarMail(receptor, asunto, texto) {
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
        subject: asunto,
        text: texto
    }

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail(mensaje);

    console.log(info);
}


module.exports = enviarMail;