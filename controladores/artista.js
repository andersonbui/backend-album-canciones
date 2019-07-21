'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var path = require('path');
var fs = require('fs');

var Artista = require('../modelos/artista');
var Album = require('../modelos/album');
var Cancion = require('../modelos/cancion');
var mongoosePaginate = require('mongoose-pagination');

function obtenerArtista(req, res){
    var idArtista = req.params.id;
    Artista.findById(idArtista, (err, artista) => {
        if(err) {
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if(!artista) { 
                res.status(404).send({message: "No se encontro el artista"});
            } else {
                res.status(200).send({artista});
            }
        }
    });
}

function obtenerArtistas(req, res) {
    var itemsPorPagina = 2;
    var pagina = 1;
    if(req.params.pagina) {
        pagina = req.params.pagina;
    } 

    Artista.find().sort('nombre').paginate(pagina, itemsPorPagina, function(err, artistas, total) {
        if(err) {
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if(!artistas) {
                res.status(404).send({message: "No hay artistas"});
            } else {
                res.status(200).send({
                    totalItems:  total,
                    artistas: artistas
                });
            }
        }
    });
}

function guardar(req, res){
    var artista =  new Artista();
    var params = req.body;
    artista.nombre = params.nombre;
    artista.descripcion = params.descripcion;
    artista.imagen = params.imagen;

    artista.save((err, artistaGuardado) => {
        if(err){
            res.status(500).send({message: "Error al guardar artista"});
        } else {
            if(!artistaGuardado) {
                res.status(200).send({message: "El artista no ha sido guardado"});
            } else {
                res.status(200).send({artista: artistaGuardado});
            }
        }

    });
}

function actualizar(req, res) {
    var id =req.params.id;
    var artista = req.body;

    Artista.findOneAndUpdate(id, artista, (err, artistaActualizado) => {
        if(err) {
            res.status(500).send({message: "Error al guardar artista"});
        } else {
            if(!artistaActualizado) {
                res.status(404).send({message: "Artista no encontrado"});
            } else {
                res.status(200).send({artista: artistaActualizado});
            }
        }
    });
}

function eliminar(req, res) {
    var idArtista = req.params.id;
    Artista.findOneAndRemove({_id: idArtista}, (err, artistaRemovido) => {
        if(err) {
            res.status(500).send({message: "Error al eliminar el artista"});
        } else {
            if(!artistaRemovido) {
                res.status(404).send({message: "Artista no ha sido eliminado"});
            } else {
                Album.find({artista: artistaRemovido._id}).remove((err, albumremovido) => {
                    if(err) {
                        res.status(500).send({message: "Error al eliminar el albunes de artista"});
                    } else {
                        if(!albumremovido) {
                            res.status(404).send({message: "No albunes que eliminar para el artista"});
                        } else {
                            Cancion.find({album: albumremovido._id}).remove((err, cancionremovida) => {
                                if(err) {
                                    res.status(500).send({message: "Error al eliminar las canciones"});
                                } else {
                                    if(!cancionremovida) {
                                        res.status(404).send({message: "No hay canciones que leiminar"});
                                    } else {
                                        // res.status(404).send({message: ""});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}


function subirImagen(req, res) {
    var idArtista = req.params.id;
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
            Artista.findOneAndUpdate({_id : idArtista}, {imagen: nombreArchivo}, (err, artistaActualizado) => {
                if(err) {
                    res.status(404).send({message: 'No se pudo actualizar la imagen'});
                } else {
                    res.status(200).send({artista: artistaActualizado});
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
    let imagen = './subidas/artistas/'+archivo_imagen;
    fs.exists(imagen, (exist) => {
        if(exist){
            res.status(200).sendFile(path.resolve(imagen));
        } else {
            res.status(200).send({message: 'fichero no existe'});
        }
    });
}

module.exports = {
    obtenerArtista,
    guardar,
    obtenerArtistas,
    actualizar,
    eliminar,
    subirImagen,
    obtenerImagen
};