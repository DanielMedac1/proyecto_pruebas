//Importación de las librerías
const express = require('express')
const fs = require('fs')

//Creación de la aplicación
const app = express()
app.use(express.static('public'))

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

//Consultas BBDD
app.get('/consulta', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('Conectado a la base de datos MySQL')
        connection.query('SELECT * FROM prueba', (err, rows) => {
            console.log('- Consulta realizada -')
            connection.release() // return the connection to pool
            console.log('Desconexión de la base de datos MySQL')

            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
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