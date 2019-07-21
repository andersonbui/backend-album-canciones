'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var path = require('path');
var fs = require('fs');

var Album = require('../modelos/album');
var Cancion = require('../modelos/cancion');
var mongoosePaginate = require('mongoose-pagination');

function obtenerAlbum(req, res){
    var idAlbum = req.params.id;
    Album.findById({_id: idAlbum}).populate({path: 'artista'}).exec((err, album) => {
        if(err) {
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if(!album) { 
                res.status(404).send({message: "No se encontro el album"});
            } else {
                res.status(200).send({album});
            }
        }
    });
}

function guardar(req, res){
    var album =  new Album();
    var params = req.body;
    album.titulo = params.titulo;
    album.descripcion = params.descripcion;
    album.anio = params.anio;
    album.imagen = params.imagen;
    album.artista = params.artista;

    album.save((err, albumGuardado) => {
        if(err){
            res.status(500).send({message: "Error al guardar album"});
        } else {
            if(!albumGuardado) {
                res.status(404).send({message: "El album no ha sido guardado"});
            } else {
                res.status(200).send({album: albumGuardado});
            }
        }

    });
}

function obtenerAlbums(req, res) {
    var idArtista = req.params.artista;
    var find = null;
    if(!idArtista) {
        // Sacar todos los albums de la BD
        find = Album.find({}).sort('title');
    } else {
        // Sacar los albums del artista
        find = Album.find({artista: idArtista}).sort('year');
    }
    find.populate({path: 'artista'}).exec((err, album) => {
        if(err) {
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if(!album) { 
                res.status(404).send({message: "No hay albums"});
            } else {
                res.status(200).send({album});
            }
        }
    });
}

function actualizar(req, res) {
    var id = req.params.id;
    var album = req.body;

    Album.findOneAndUpdate({_id: id}, album, (err, albumActualizado) => {
        if(err) {
            res.status(500).send({message: "Error al guardar album"});
        } else {
            if(!albumActualizado) {
                res.status(404).send({message: "Album no encontrado"});
            } else {
                res.status(200).send({album: albumActualizado});
            }
        }
    });
}

function eliminar(req, res) {
    var idAlbum = req.params.id;
    Album.findOneAndRemove({_id: idAlbum}, (err, albumRemovido) => {
        if(err) {
            res.status(500).send({message: "Error al eliminar el album"});
        } else {
            if(!albumRemovido) {
                res.status(404).send({message: "Album no ha sido eliminado"});
            } else {
                Cancion.deleteMany({album: albumRemovido._id},(err, cancionremovida) => {
                    if(err) {
                        res.status(500).send({message: "Error al eliminar las canciones"});
                    } else {
                        if(!cancionremovida) {
                            res.status(404).send({message: "No hay canciones que leiminar"});
                        } else {
                            res.status(404).send({message: cancionremovida});
                        }
                    }
                });
            }
        }
    });
}


function subirImagen(req, res) {
    var idAlbum = req.params.id;
    var nombreArchivo = 'no subido ...';
    if (req.files && req.files.imagen){
        var rutaArchivo = req.files.imagen.path;
        let file_spli = rutaArchivo.split('/');
        if(file_spli.length == 1){
            nombreArchivo = file_spli[0].split('\\')[2];
        } else {
            nombreArchivo = file_spli[2];
        }
        let extension = rutaArchivo.split('\.')[1];
        if(extension == 'png' || extension == 'jpg' || extension == 'gif') {
            Album.findOneAndUpdate({_id : idAlbum}, {imagen: nombreArchivo}, (err, albumActualizado) => {
                if(err) {
                    res.status(404).send({message: 'No se pudo actualizar la imagen'});
                } else {
                    res.status(200).send({album: albumActualizado});
                }
            });
        } else {
            res.status(200).send({message: 'Extension del archivo no valida'});
        }
        console.log(nombreArchivo);
        console.log(extension);
    } else {
        res.status(200).send({message: 'No has subido ninguna imagen'});
    }
}

function obtenerImagen(req, res) {
    let archivo_imagen = req.params.archivoImagen;
    let imagen = './subidas/albums/'+archivo_imagen;
    fs.exists(imagen, (exist) => {
        if(exist){
            res.status(200).sendFile(path.resolve(imagen));
        } else {
            res.status(200).send({message: 'fichero no existe'});
        }
    });
}

module.exports = {
    obtenerAlbum,
    guardar,
    obtenerAlbums,
    actualizar,
    eliminar,
    subirImagen,
    obtenerImagen
};