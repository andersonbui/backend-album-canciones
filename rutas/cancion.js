'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var express = require('express');
var CancionController = require('../controladores/cancion');
var api = express.Router();
var md_auth = require('../intermediario/autenticar');
var multipart = require('connect-multiparty');
var md_subidas = multipart({uploadDir: './subidas/canciones'});

api.get('/cancion/:id',md_auth.asegurarAut, CancionController.obtenerCancion);
api.post('/cancion',md_auth.asegurarAut, CancionController.guardar);
api.get('/canciones/:album?',md_auth.asegurarAut, CancionController.obtenerCanciones);
api.put('/cancion/:id',md_auth.asegurarAut, CancionController.actualizar);
api.delete('/cancion/:id',md_auth.asegurarAut, CancionController.eliminar);
api.post('/cancion/subir-archivo/:id', [md_auth.asegurarAut, md_subidas] ,CancionController.subirArchivo);
api.get('/cancion/obtener-archivo/:archivoArchivo', CancionController.obtenerArchivo);

module.exports = api;