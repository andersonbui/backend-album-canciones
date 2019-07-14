'use strict'

var mongoose = require('mongoose');
var Schema = mogngoose.Schema;

var CancionSchema = Schema({
    numero: Number,
    nombre: String,
    duracion: String,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Cancion', CancionSchema);