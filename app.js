'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var rutas_usuario = require('./rutas/usuario');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configurar cabeceras http

// rutas base
app.use('/api',rutas_usuario); // (middleware) en el navegador localhost:port/api/<rutas_usuario>

/*app.get('/pruebas', function(req, res){
    res.status(200).send({message:'cuerpo'})
})*/

module.exports = app;