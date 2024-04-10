//Importación de las librerías
const express = require('express');
const fs = require('fs');
var session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { confirmationMail, resetMail } = require('./email-controller.js');
const rateLimiter = require('express-rate-limit');

//Creación de la aplicación
const app = express()

//Para los ficheros HTML
app.use(express.static('public'))
app.use('/styles', express.static(__dirname + '/public/css'));

//Para los ficheros EJS
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: 'TtwDnEKvK10E9to',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        name: 'session_id',
        httpOnly: true,
        //secure: true //ESTO PARA CUANDO LO SUBAMOS AL RENDER
    }
}));

//Conexión a la base de datos
const pool = require('./db/db_sql.js')
const uri = require('./db/db_mongo.js')

//Middleware de autenticación
var auth = function (req, res, next) {
    if (req.session && (req.session.admin || req.session.user)) {
        return next();
    } else {
        console.log("Reririge")
        res.redirect('/login');
    }
}

//Middleware de limite de peticiones
const limiter = rateLimiter({
    windowsMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Demasiadas peticiones, espera 15 minutos'
})

app.use(limiter)

// Función para encriptar una contraseña con bcrypt
async function encrypt(value) {
    const saltRounds = 10; // Número de rondas de hashing
    const hashedValue = await bcrypt.hash(value, saltRounds);
    return hashedValue;
}

//Función para enviar respuestas JSON más facilmente
function sendResponse(res, message) {
    res.send({ "res": message });
}

//Función para generar tokens
function generateToken(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}


//Rutas de páginas
app.get('/', (req, res) => {
    var contenido = fs.readFileSync('public/index.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})
app.get('/login', (req, res) => {
    var contenido = fs.readFileSync('public/iniciarSesion.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})
app.get('/register', (req, res) => {
    var contenido = fs.readFileSync('public/registrarUsuario.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})
app.get('/reset-password', (req, res) => {
    var contenido = fs.readFileSync('public/resetPass1.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})

app.get('/profile', auth, (req, res) => {
    if (req.session.admin || req.session.user) {
        res.render('profile-info', { usuario: req.session.info });
    } else {
        res.redirect('/login');
    }
})
app.get('/home', auth, (req, res) => {
    if (req.session.admin) {
        res.render('admin/home-admin', { usuario: req.session.info });
    } else if (req.session.user) {
        res.render('usuario/home-user', { usuario: req.session.info });
    } else {
        res.redirect('/login');
    }
})

//Ruta para que se cierre la sesión del usuario
app.post('/destroy-session', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid', { path: '/' });
})

//Consultas BBDD para la gestión de cuentas de usuario

//Para el inicio de sesión del usuario
/* app.post('/iniciar', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        sendResponse(res, "login failed");
    } else {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Error al obtener la conexión de la pool: ', err);
                sendResponse(res, "login error");
            } else {
                connection.query('SELECT * FROM usuarios WHERE username = ? AND password = ?', [req.body.username, req.body.password], async function (error, results, fields) {
                    connection.release(); // Liberar la conexión después de usarla

                    if (error) {
                        console.error('Error al ejecutar la consulta: ', error);
                    } else {
                        if (results.length > 0) {
                            if (results.length > 0) {
                                if (results[0].is_confirmed === 0 || results[0].confirm_token !== null) {
                                    sendResponse(res, "login unconfirmed");
                                    return;
                                }

                                const hashedPassword = results[0].password;
                                const passwordMatch = await bcrypt.compare(password, hashedPassword);

                                if (!passwordMatch) {
                                    console.log("Entra por acá")
                                    sendResponse(res, "login invalid");
                                    return;
                                }

                                const esAdmin = parseInt(results[0].admin);
                                var rol = "";

                                if (esAdmin === 1) {
                                    req.session.admin = true;
                                    rol = "Administrador";
                                    console.log("Entró un administrador")
                                } else {
                                    req.session.user = true;
                                    rol = "Usuario";
                                    console.log("Entró un usuario")
                                }

                                const fecha = results[0].fecha;
                                var dia = fecha.getDate();
                                var numMes = fecha.getMonth() + 1;
                                var nombreMes;
                                var anio = fecha.getFullYear();

                                switch (numMes) {
                                    case 1:
                                        nombreMes = 'Enero';
                                        break;
                                    case 2:
                                        nombreMes = 'Febrero';
                                        break;
                                    case 3:
                                        nombreMes = 'Marzo';
                                        break;
                                    case 4:
                                        nombreMes = 'Abril';
                                        break;
                                    case 5:
                                        nombreMes = 'Mayo';
                                        break;
                                    case 6:
                                        nombreMes = 'Junio';
                                        break;
                                    case 7:
                                        nombreMes = 'Julio';
                                        break;
                                    case 8:
                                        nombreMes = 'Agosto';
                                        break;
                                    case 9:
                                        nombreMes = 'Septiembre';
                                        break;
                                    case 10:
                                        nombreMes = 'Octubre';
                                        break;
                                    case 11:
                                        nombreMes = 'Noviembre';
                                        break;
                                    case 12:
                                        nombreMes = 'Diciembre';
                                        break;
                                }

                            }
                            const usuario = {
                                username: results[0].username,
                                email: results[0].email,
                                password: results[0].password,
                                dia: dia,
                                mes: nombreMes,
                                anio: anio,
                                rol: rol
                            }
                            req.session.info = usuario;
                            if (req.body.remember) {
                                console.log("Recordar usuario")
                                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // Duración de la sesión si se recuerda al usuario
                                req.session.save(function (err) {
                                    if (err) {
                                        console.error('Error al guardar la sesión: ', err);
                                    } else {
                                        console.log('Sesión guardada');
                                    }
                                });
                            }
                            sendResponse(res, "login true");

                        } else {
                            console.log("Segundo entra")
                            sendResponse(res, "login invalid");
                        }
                    }
                });
            }
        });
    }
}); */

app.post('/iniciar', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        sendResponse(res, "login failed");
    } else {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Error al obtener la conexión de la pool: ', err);
                sendResponse(res, "login error");
            } else {
                connection.query('SELECT * FROM usuarios WHERE username = ?', [req.body.username], async function (error, results, fields) {
                    connection.release(); // Liberar la conexión después de usarla

                    if (error) {
                        console.error('Error al ejecutar la consulta: ', error);
                        sendResponse(res, "login error");
                    } else {
                        if (results.length === 0) {
                            sendResponse(res, "login invalid");
                            return;
                        }

                        const user = results[0];
                        const hashedPassword = results[0].password;

                        const passwordMatch = await bcrypt.compare(req.body.password, hashedPassword);

                        if (!passwordMatch) {
                            console.log("Contraseña incorrecta");
                            sendResponse(res, "login invalid");
                            return;
                        }

                        if (user.is_confirmed === 0 || user.confirm_token !== null) {
                            console.log("Usuario no confirmado");
                            sendResponse(res, "login unconfirmed");
                            return;
                        }

                        const esAdmin = parseInt(user.admin);
                        var rol = "";

                        if (esAdmin === 1) {
                            req.session.admin = true;
                            rol = "Administrador";
                            console.log("Entró un administrador")
                        } else {
                            req.session.user = true;
                            rol = "Usuario";
                            console.log("Entró un usuario")
                        }

                        const fecha = user.fecha;
                        var dia = fecha.getDate();
                        var numMes = fecha.getMonth() + 1;
                        var nombreMes;
                        var anio = fecha.getFullYear();

                        switch (numMes) {
                            case 1:
                                nombreMes = 'Enero';
                                break;
                            case 2:
                                nombreMes = 'Febrero';
                                break;
                            case 3:
                                nombreMes = 'Marzo';
                                break;
                            case 4:
                                nombreMes = 'Abril';
                                break;
                            case 5:
                                nombreMes = 'Mayo';
                                break;
                            case 6:
                                nombreMes = 'Junio';
                                break;
                            case 7:
                                nombreMes = 'Julio';
                                break;
                            case 8:
                                nombreMes = 'Agosto';
                                break;
                            case 9:
                                nombreMes = 'Septiembre';
                                break;
                            case 10:
                                nombreMes = 'Octubre';
                                break;
                            case 11:
                                nombreMes = 'Noviembre';
                                break;
                            case 12:
                                nombreMes = 'Diciembre';
                                break;
                        }

                        const usuario = {
                            username: user.username,
                            email: user.email,
                            password: req.body.password,
                            dia: dia,
                            mes: nombreMes,
                            anio: anio,
                            rol: rol
                        }
                        req.session.info = usuario;
                        if (req.body.remember) {
                            console.log("Recordar usuario")
                            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // Duración de la sesión si se recuerda al usuario
                            req.session.save(function (err) {
                                if (err) {
                                    console.error('Error al guardar la sesión: ', err);
                                } else {
                                    console.log('Sesión guardada');
                                }
                            });
                        }
                        sendResponse(res, "login true");
                    }
                });
            }
        });
    }
});

//Para el registro de los usuarios
app.post('/registrar', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await encrypt(password);

    if (!username || !password || !email) {
        sendResponse(res, "register failed");
        return;
    }

    if (username.length > 30 || username.length <= 5 || username.includes(' ')) {
        sendResponse(res, "invalid username");
        return;
    }

    if (email.length > 75 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        sendResponse(res, "invalid email");
        return;
    }

    if (password.length > 50 || !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_,.-])[A-Za-z\d!@#$%^&*_,.-]{8,}$/.test(password)) {
        sendResponse(res, "invalid password");
        return;
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error al obtener la conexión de la pool: ', err);
            sendResponse(res, "register failed");
            return;
        } else {
            const confirmToken = generateToken();
            connection.query('INSERT INTO usuarios(username, email, password, admin, fecha, confirm_token) VALUES (?,?,?, false, CURDATE(), ?)', [username, email, hashedPassword, confirmToken], function (error, results, fields) {
                connection.release(); // Liberar la conexión después de usarla

                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        sendResponse(res, "user exists");
                    } else {
                        console.error('Error al ejecutar la consulta: ', error);
                        sendResponse(res, "register failed");
                    }
                } else {
                    if (results.affectedRows > 0) {
                        confirmationMail(email, username, confirmToken);
                        sendResponse(res, "register true");
                    } else {
                        sendResponse(res, "register invalid");
                    }
                }
            });
        }
    });
});

//Ruta para confirmar el usuario
app.get('/confirm', (req, res) => {
    const { token } = req.query;
    pool.getConnection((err, connection) => {
        // Buscar el usuario con el token de confirmación en la base de datos
        connection.query('SELECT * FROM usuarios WHERE confirm_token = ?', [token], (err, result) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Error al confirmar el usuario.');
            } else {
                if (result.length === 0) {
                    var contenido = fs.readFileSync('public/passwordAlreadyConfirmed.html', 'utf8')
                    res.setHeader('Content-Type', 'text/html')
                    res.status(404).send(contenido);
                } else {
                    // Actualizar el estado de confirmación del usuario
                    connection.query('UPDATE usuarios SET is_confirmed = 1, confirm_token = NULL WHERE username = ?', [result[0].username], (err, updateResult) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error al confirmar el usuario.');
                        } else {
                            var contenido = fs.readFileSync('public/passwordConfirmed.html', 'utf8')
                            res.setHeader('Content-Type', 'text/html')
                            res.send(contenido);
                        }
                    });
                }
            }
        });
    })
});

//Ruta para confirmar el usuario
app.get('/reset', (req, res) => {
    const { token } = req.query;
    pool.getConnection((err, connection) => {
        // Buscar el usuario con el token de confirmación en la base de datos
        connection.query('SELECT * FROM usuarios WHERE reset_token = ?', [token], (err, result) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Error al confirmar el usuario.');
            } else {
                if (result.length === 0) {
                    var contenido = fs.readFileSync('public/notFound.html', 'utf8')
                    res.setHeader('Content-Type', 'text/html')
                    res.status(404).send(contenido);
                } else {
                    // Actualizar el estado de confirmación del usuario
                    var contenido = fs.readFileSync('public/resetPass2.html', 'utf8')
                    res.setHeader('Content-Type', 'text/html')
                    res.send(contenido);
                }
            }
        });
    })
});

//Ruta para que el usuario confirme su dirección de email
app.post('/reset-password', (req, res) => {
    const email = req.body.email;

    pool.getConnection((err, connection) => {
        connection.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, result) => {
            connection.release();
            if (err) {
                console.error(err);
                sendResponse(res, "email error");
            } else {
                if (result.length === 0) {
                    console.log("No existe el usuario")
                    sendResponse(res, "email invalid");
                } else {
                    const resetToken = generateToken();
                    const usuario = result[0].username;

                    connection.query('UPDATE usuarios SET reset_token = ? WHERE email = ?', [resetToken, email], (err, results) => {
                        if (err) {
                            console.error(err);
                            res.status(500).send('Error al confirmar el usuario.');
                        } else {
                            if (results.affectedRows > 0) {
                                console.log("Usuario: " + usuario)
                                resetMail(email, usuario, resetToken);
                                sendResponse(res, "email true");
                            } else {
                                sendResponse(res, "email error");
                            }
                        }
                    })
                }
            }
        })
    })
});

//Para que el usuario pueda cambiar la contraseña
app.post('/change-password', async (req, res) => {
    const password = req.body.password;

    if (password == "" || password.length > 50 || !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_.])[A-Za-z\d!@#$%^&*_.]{8,}$/.test(password)) {
        sendResponse(res, "change invalid");
        return;
    }

    const hashedPassword = await encrypt(password);

    pool.getConnection(function (err, connection) {
        connection.query('UPDATE usuarios SET password = ? WHERE username = ?', [hashedPassword, req.session.info.username], (err, updateResult) => {
            connection.release();
            if (err) {
                console.error(err);
                sendResponse(res, "change error");
            } else {
                sendResponse(res, "change success");
            }
        });
    })
});


//En el caso de que vayamos a una ruta que no existe, se lanzará un error 404
app.use((req, res, next) => {
    var contenido = fs.readFileSync('public/notFound.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.status(404).send(contenido);
});


//Servidor
const port = 3005;
app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`)
})