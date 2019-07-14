'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    email: String,
    clave: String,
    rol: String,
    imagen: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema);