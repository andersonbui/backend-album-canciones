'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var express = require('express');
var UserController = require('../controladores/usuario');
var md_aut = require('../intermediario/autenticar');
var api = express.Router();
var multipart = require('connect-multiparty');
var md_subidas = multipart({uploadDir: './subidas/usuarios'});

api.post('/login', md_aut.asegurarAut, UserController.login);
api.put('/usuarios/actualizar/:_id', md_aut.asegurarAut, UserController.actualizar);
api.get('/usuarios', UserController.api);
api.post('/usuarios/registrar',UserController.guardar);
api.post('/usuarios/subir-imagen/:id', [md_aut.asegurarAut, md_subidas] ,UserController.subirImagen);


module.exports = api;