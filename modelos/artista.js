'use strict'

var mongoose = require('mongoose');
var Schema = mogngoose.Schema;

var ArtistaSchema = Schema({
    nombre: String,
    descripcion: String,
    imagen: String
});

module.exports = mongoose.model('Artista', ArtistaSchema);