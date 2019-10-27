'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var express = require('express');
var UserController = require('../controladores/usuario');
var md_aut = require('../intermediario/autenticar');
var api = express.Router();
var multipart = require('connect-multiparty');
var md_subidas = multipart({uploadDir: './subidas/usuarios'});

api.post('/login', UserController.login);
api.post('/usuarios/registrar',UserController.guardar);
api.put('/usuarios/actualizar/:id', md_aut.asegurarAut, UserController.actualizar);
api.post('/usuarios/subir-imagen/:id', [md_aut.asegurarAut, md_subidas] ,UserController.subirImagen);
api.get('/usuarios/obtener-imagen/:archivoImagen', UserController.obtenerImagen);


module.exports = api;