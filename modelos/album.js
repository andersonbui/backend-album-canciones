'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    titulo: String,
    descripcion: String,
    anio: Number,
    imagen: String,
    artista: { type: Schema.ObjectId, ref: 'Artista'}
});

module.exports = mongoose.model('Album', AlbumSchema);