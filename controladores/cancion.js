'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var path = require('path');
var fs = require('fs');

var Cancion = require('../modelos/cancion');
var Cancion = require('../modelos/cancion');
var mongoosePaginate = require('mongoose-pagination');

function obtenerCancion(req, res){
    var idCancion = req.params.id;
    Cancion.findById({_id: idCancion}).populate({path: 'album'}).exec((err, cancion) => {
        if(err) {
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if(!cancion) { 
                res.status(404).send({message: "No se encontro la cancion"});
            } else {
                res.status(200).send({cancion});
            }
        }
    });
}

function guardar(req, res){
    var cancion =  new Cancion();
    var params = req.body;
    cancion.nombre = params.nombre;
    cancion.numero = params.numero;
    cancion.duracion = params.duracion;
    cancion.archivo = null;
    cancion.album = params.album;

    cancion.save((err, cancionGuardada) => {
        if(err){
            res.status(500).send({message: "Error al guardar cancion"});
        } else {
            if(!cancionGuardada) {
                res.status(404).send({message: "La cancion no ha sido guardada"});
            } else {
                res.status(200).send({cancion: cancionGuardada});
            }
        }

    });
}

function obtenerCanciones(req, res) {
    var idAlbum = req.params.album;
    var find = null;
    if(!idAlbum) {
        // Sacar todos los canciones de la BD
        find = Cancion.find({});
    } else {
        // Sacar los canciones del album
        find = Cancion.find({album: idAlbum});
    }
    find.sort('number').populate({
        path: 'album', 
        populate: {
            path: 'artista', 
            model: 'Artista'
        } 
    }).exec((err, cancion) => {
        if(err) {
            res.status(500).send({message: "Error en la peticion"});
        } else{
            if(!cancion) { 
                res.status(404).send({message: "No hay canciones"});
            } else {
                res.status(200).send({cancion});
            }
        }
    });
}

function actualizar(req, res) {
    var id = req.params.id;
    var cancion = req.body;

    Cancion.findOneAndUpdate({_id: id}, cancion, (err, cancionActualizado) => {
        if(err) {
            res.status(500).send({message: "Error al guardar cancion"});
        } else {
            if(!cancionActualizado) {
                res.status(404).send({message: "Cancion no encontrado"});
            } else {
                res.status(200).send({cancion: cancionActualizado});
            }
        }
    });
}

function eliminar(req, res) {
    var idCancion = req.params.id;
    Cancion.findOneAndRemove({_id: idCancion}, (err, cancionRemovida) => {
        if(err) {
            res.status(500).send({message: "Error al eliminar el cancion"});
        } else {
            if(!cancionRemovida) {
                res.status(404).send({message: "Cancion no ha sido eliminado"});
            } else {
                res.status(404).send({message: cancionRemovida});
            }
        }
    });
}

function subirArchivo(req, res) {
    var idCancion = req.params.id;
    var nombreArchivo = 'no subido ...';
    if (req.files && req.files.archivo){
        var rutaArchivo = req.files.archivo.path;
        let file_spli = rutaArchivo.split('/');
        if(file_spli.length == 1){
            nombreArchivo = file_spli[0].split('\\')[2];
        } else {
            nombreArchivo = file_spli[2];
        }
        let extension = rutaArchivo.split('\.')[1];
        if(extension == 'mp3' || extension == 'ogg') {
            Cancion.findOneAndUpdate({_id : idCancion}, {archivo: nombreArchivo}, (err, cancionActualizado) => {
                if(err) {
                    res.status(404).send({message: 'No se pudo actualizar el archivo'});
                } else {
                    res.status(200).send({cancion: cancionActualizado, archivo: nombreArchivo});
                }
            });
        } else {
            res.status(200).send({message: 'Extension del archivo no valida'});
        }
        console.log(nombreArchivo);
        console.log(extension);
    } else {
        res.status(200).send({message: 'No ha podido subir ningun archivo'});
    }
}

function obtenerArchivo(req, res) {
    let archivo_archivo = req.params.archivoArchivo;
    let archivo = './subidas/canciones/'+archivo_archivo;
    fs.exists(archivo, (exist) => {
        if(exist){
            res.status(200).sendFile(path.resolve(archivo));
        } else {
            res.status(200).send({message: 'fichero no existe'});
        }
    });
}

module.exports = {
    obtenerCancion,
    guardar,
    obtenerCanciones,
    actualizar,
    eliminar,
    subirArchivo,
    obtenerArchivo
};