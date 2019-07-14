'use strict';
/*jshint node:true */
/*esversion : 6*/

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave-secreta';

exports.crearTokent = function(usuario){
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apelido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        imagen: usuario.imagen,
        iat: moment().unix(), // fecha creacion
        exp: moment().add(30,'days').unix // fecha expiracion
    };
    // los datos seran codificados con la variable secreta
    return jwt.encode(payload, secret);
};