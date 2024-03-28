//Importación de las librerías
const express = require('express')
const fs = require('fs')
var session = require('express-session');

//Creación de la aplicación
const app = express()

//Para los ficheros HTML
app.use(express.static('public'))
app.use('/styles', express.static(__dirname + '/public/css'));

//Para los ficheros EJS
app.set('views', 'views')
app.set('view engine', 'ejs')


app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

var auth = function (req, res, next) {
    if (req.session && (req.session.admin || req.session.user)) {
        return next();
    } else {
        res.redirect('/iniciarSesion');
    }
}

//Conexión a la base de datos
const pool = require('./db/db_sql.js')

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
        res.render('admin/prueba-admin');
    } else if (req.session.user) {
        res.render('usuario/prueba-usuario');
    } else {
        res.redirect('/iniciarSesion');
    }
})
app.get('/destruir', (req, res) => {
    req.session.destroy();
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
                res.send({ "res": "login failed" });
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

    if (username.length > 30 || username.length < 5 || username.includes(' ')) {
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
            connection.query('INSERT INTO usuarios(username, email, password, admin) VALUES (?,?,?, false)', [username, email, password], function (error, results, fields) {
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
app.use((req, res) => {
    res.redirect('/');
});

//Servidor
const port = 3005;
app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`)
})