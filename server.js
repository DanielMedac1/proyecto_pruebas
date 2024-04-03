//Importación de las librerías
const express = require('express')
const fs = require('fs')
var session = require('express-session');
const cookieParser = require('cookie-parser')
const crypto = require('crypto');
const MongoDBStore = require('connect-mongodb-session')(session);

//Creación de la aplicación
const app = express()

//Para los ficheros HTML
app.use(express.static('public'))
app.use('/styles', express.static(__dirname + '/public/css'));

//Para los ficheros EJS
app.set('views', 'views')
app.set('view engine', 'ejs')

const storeSession = new MongoDBStore({
    uri: 'mongodb+srv://infocyberniks:jesucristoNuestroSeñor1999@cluster0.pvhjqm8.mongodb.net/CyberNiks?retryWrites=true&w=majority&appName=Cluster0',
    collection: 'sessions'
});

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

var auth = function (req, res, next) {
    if (req.session && (req.session.admin || req.session.user)) {
        return next();
    } else {
        console.log("Reririge")
        res.redirect('/iniciarSesion');
    }
}

//Conexión a la base de datos
const pool = require('./db/db_sql.js')
const uri = require('./db/db_mongo.js')

//Rutas
app.get('/', (req, res) => {
    var contenido = fs.readFileSync('public/index.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})
app.get('/iniciarSesion', (req, res) => {
    var contenido = fs.readFileSync('public/iniciarSesion.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})
app.get('/registrarUsuario', (req, res) => {
    var contenido = fs.readFileSync('public/registrarUsuario.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})
app.get('/ruta-prueba', auth, (req, res) => {
    if (req.session.admin) {
        res.render('admin/prueba-admin', { usuario: req.session.info });
    } else if (req.session.user) {
        res.render('usuario/prueba-usuario', { usuario: req.session.info });
    } else {
        res.redirect('/iniciarSesion');
    }
})
app.get('/destroy-session', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect('/iniciarSesion');
})

//Consultas BBDD
/* app.get('/consulta', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('Conectado a la base de datos MySQL')
        connection.query('SELECT * FROM prueba', (err, rows) => {
            console.log('- Consulta realizada -')
            connection.release() // Devolver la conexión a la pool
            console.log('Desconexión de la base de datos MySQL')

            if (!err) {
                if (rows.length > 0) {
                    const campo3Value = rows[0].campo3.toString();
                    res.send(campo3Value);
                } else {
                    res.send('No se encontraron resultados');
                }
                res.end();
            } else {
                console.log(err)
            }
        })
    })
}) */

app.post('/iniciar', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.send({ "res": "login failed" })
    } else {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Error al obtener la conexión de la pool: ', err);
                res.send({ "res": "login error" });
            } else {
                connection.query('SELECT * FROM usuarios WHERE username = ? AND password = ?', [req.body.username, req.body.password], function (error, results, fields) {
                    connection.release(); // Liberar la conexión después de usarla

                    if (error) {
                        console.error('Error al ejecutar la consulta: ', error);
                    } else {
                        if (results.length > 0) {
                            if (results.length > 0) {
                                const esAdmin = parseInt(results[0].admin);
                                if (esAdmin === 1) {
                                    req.session.admin = true;
                                    console.log("Entró un administrador")
                                } else {
                                    req.session.user = true;
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
                                anio: anio
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
                            res.send({ "res": "login true" });

                        } else {
                            res.send({ "res": "login invalid" });
                        }
                    }
                });
            }
        });
    }
})

/* app.post('/registrar', async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.send({ "res": "register failed" })
    } else {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.error('Error al obtener la conexión de la pool: ', err);
                res.send({ "res": "register failed" });
            } else {
                connection.query('INSERT INTO usuarios(username, email, password, admin) VALUES (?,?,?, false)', [req.body.username, req.body.email, req.body.password], function (error, results, fields) {
                    connection.release(); // Liberar la conexión después de usarla

                    if (error) {
                        if (error.code === 'ER_DUP_ENTRY') {
                            // Manejar el error de clave duplicada aquí
                            res.send({ "res": "user exists" });
                        } else {
                            console.error('Error al ejecutar la consulta: ', error);
                        }
                    } else {
                        if (results.affectedRows > 0) {
                            res.send({ "res": "register true" });
                        } else {
                            res.send({ "res": "register invalid" });
                        }
                    }
                });
            }
        });
    }
}) */

app.post('/registrar', async (req, res) => {
    const { username, password, email } = req.body;

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

    if (password.length > 50 || !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_.])[A-Za-z\d!@#$%^&*_.]{8,}$/.test(password)) {
        sendResponse(res, "invalid password");
        return;
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error al obtener la conexión de la pool: ', err);
            sendResponse(res, "register failed");
            return;
        } else {
            connection.query('INSERT INTO usuarios(username, email, password, admin, fecha) VALUES (?,?,?, false, CURDATE())', [username, email, password], function (error, results, fields) {
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
                        sendResponse(res, "register true");
                    } else {
                        sendResponse(res, "register invalid");
                    }
                }
            });
        }
    });
});

function sendResponse(res, message) {
    res.send({ "res": message });
}



//En el caso de que vayamos a una ruta que no existe, irá a la raiz por defecto
app.use((req, res, next) => {
    res.redirect('/');
});




//Servidor
const port = 3005;
app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`)
})