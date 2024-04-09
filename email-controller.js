const nodemailer = require('nodemailer');

async function confirmationMail(receptor, usuario, token) {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'infocyberniks@gmail.com',
            pass: 'hmav lyif sxwf lpav'
        }
    }

    const mensaje = {
        from: 'CyberNiks <infocyberniks@gmail.com>',
        to: receptor,
        subject: "Confirma tu registro en CyberNiks",
        html: `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                }
                p {
                    color: #555;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: greenyellow;
                    color: #000000;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .button:hover {
                    background-color: rgb(141, 211, 37);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Confirma tu cuenta</h1>
                <p>¡Bienvenido, <b>${usuario}</b>!</p>
                <p>Tu cuenta ha sido creada exitosamente en nuestra plataforma.</p>
                <p>La información de tu cuenta se encuentra debajo:</p>
                <p><b>E-mail:</b> ${receptor}</p>
                <br>
                <p>Para validar tu dirección de correo electrónico, por favor haz clic en el enlace de debajo:</p>
                <a class="button" href="http://localhost:3005/confirm?token=${token}"><b>Confirmar mi cuenta</b></a>
                <p>Atentamente,<br><i>el equipo de CyberNiks</i></p>
                <p><small>&copy; 2024 CyberNiks</small></p>
            </div>
        </body>
        </html>
    `
    }

    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail(mensaje);

    console.log(info);
}

module.exports = confirmationMail;