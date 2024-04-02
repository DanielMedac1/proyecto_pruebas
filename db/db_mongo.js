const mongoose = require('mongoose');

const uri = mongoose.connect('mongodb+srv://infocyberniks:jesucristoNuestroSeñor1999@cluster0.pvhjqm8.mongodb.net/CyberNiks?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Conexión a MongoDB establecida'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = uri