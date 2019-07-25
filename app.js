'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var rutas_usuario = require('./rutas/usuario');
var rutas_artista = require('./rutas/artista');
var rutas_album = require('./rutas/album');
var rutas_canciones = require('./rutas/cancion');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configurar cabeceras http
app.use((req, res, siguiente) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
    // res.header('Access-Control-Allow-Credentials', true);
    // res.set('Accept', 'application/json');
    // res.header('Access-Control-Max-Age', 86400);
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    siguiente();
});

// rutas base
app.use('/api',rutas_usuario); // (middleware) en el navegador localhost:port/api/<rutas_usuario>
app.use('/api',rutas_artista); // (middleware) en el navegador localhost:port/api/<rutas_usuario>
app.use('/api',rutas_album); // (middleware) en el navegador localhost:port/api/<rutas_usuario>
app.use('/api',rutas_canciones); // (middleware) en el navegador localhost:port/api/<rutas_usuario>

/*app.get('/pruebas', function(req, res){
    res.status(200).send({message:'cuerpo'})
})*/

module.exports = app;