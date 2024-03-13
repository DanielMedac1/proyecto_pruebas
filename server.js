//Importación de las librerías
const express = require('express')
const fs = require('fs')

//Creación de la aplicación
const app = express()
app.use(express.static('public'))

//Puerto
const port = 3002;

//GET's
app.get('/', (req, res) => {
    var contenido = fs.readFileSync('public/index.html', 'utf8')
    res.setHeader('Content-Type', 'text/html')
    res.send(contenido)
})

//Servidor
app.listen(port, () => {
    console.log(`Aplicación escuchando en el puerto ${port}`)
})