'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CancionSchema = Schema({
    numero: Number,
    nombre: String,
    duracion: String,
    archivo: String,
    album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Cancion', CancionSchema);