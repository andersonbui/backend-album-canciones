'use strict'

var mongoose = require('mongoose');
var Schema = mogngoose.Schema;

var AlbumSchema = Schema({
    titulo: String,
    descripcion: String,
    ano: Number,
    imagen: String,
    artista: { type: Schema.ObjectId, ref: 'Artista'}
});

module.exports = mongoose.model('Album', AlbumSchema);