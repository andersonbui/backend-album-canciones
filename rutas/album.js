'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var express = require('express');
var AlbumController = require('../controladores/album');
var api = express.Router();
var md_auth = require('../intermediario/autenticar');
var multipart = require('connect-multiparty');
var md_subidas = multipart({uploadDir: './subidas/albums'});

api.get('/album/:id',md_auth.asegurarAut, AlbumController.obtenerAlbum);
api.post('/album',md_auth.asegurarAut, AlbumController.guardar);
api.get('/albums/:artista?',md_auth.asegurarAut, AlbumController.obtenerAlbums);
api.put('/album/:id',md_auth.asegurarAut, AlbumController.actualizar);
api.delete('/album/:id',md_auth.asegurarAut, AlbumController.eliminar);
api.post('/album/subir-imagen/:id', [md_auth.asegurarAut, md_subidas] ,AlbumController.subirImagen);
api.get('/album/obtener-imagen/:archivoImagen', AlbumController.obtenerImagen);

module.exports = api;