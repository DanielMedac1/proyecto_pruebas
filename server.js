//Importación de las librerías
const express = require('express')
const fs = require('fs')

//Creación de la aplicación
const app = express()
app.use(express.static('public'))
app.use(express.json());

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
app.get('/ruta', (req, res) => {
    res.send('<h1>Ruta protegida</h1>')
})

//Consultas BBDD
app.get('/consulta', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('Conectado a la base de datos MySQL')
        connection.query('SELECT * FROM usuarios', (err, rows) => {
            console.log('- Consulta realizada -')
            connection.release() // Devolver la conexión a la pool
            console.log('Desconexión de la base de datos MySQL')

            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
})

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
                            res.send({ "res": "login true"});
                        } else {
                            res.send({ "res": "login invalid" });
                        }
                    }
                });
            }
        });
    }
})

//En el caso de que vayamos a una ruta que no existe, irá a la raiz por defecto
app.use((req, res) => {
    res.redirect('/');
});

//Servidor
const port = 3005;
app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`)
})