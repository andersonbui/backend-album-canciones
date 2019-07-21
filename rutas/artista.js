'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var express = require('express');
var ArtistaController = require('../controladores/artista');
var api = express.Router();
var md_auth = require('../intermediario/autenticar');
var multipart = require('connect-multiparty');
var md_subidas = multipart({uploadDir: './subidas/artistas'});

api.get('/artista/:id',md_auth.asegurarAut, ArtistaController.obtenerArtista);
api.post('/artista',md_auth.asegurarAut, ArtistaController.guardar);
api.get('/artistas/:pagina?',md_auth.asegurarAut, ArtistaController.obtenerArtistas);
api.put('/artista/:id',md_auth.asegurarAut, ArtistaController.actualizar);
api.delete('/artista/:id',md_auth.asegurarAut, ArtistaController.eliminar);
api.post('/artista/subir-imagen/:id', [md_auth.asegurarAut, md_subidas] ,ArtistaController.subirImagen);
api.get('/artista/obtener-imagen/:archivoImagen', ArtistaController.obtenerImagen);

module.exports = api;