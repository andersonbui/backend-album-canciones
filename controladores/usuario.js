'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../modelos/usuario');
var jwt = require('../servicios/jwt');
var fs = require('fs');
var path = require('path');

function guardar(req, res){
    var usuario = new Usuario();

    var parametros = req.body;

    console.log(parametros);

    usuario.nombre = parametros.nombre;
    usuario.apellido = parametros.apellido;
    usuario.email = parametros.email;
    usuario.rol = 'ROL_ADMINs';
    usuario.imagen = 'null';

    // if(parametros.token === 'admin'){
        // encriptar contrasena y guardar datos
        bcrypt.hash(parametros.clave,null,null, function(err, hash){
            usuario.clave = hash;
            if(usuario.nombre != null && usuario.apellido != null && usuario.email != null){
                // guardar datos
                usuario.save((err, usuarioGuardado) => {
                    if(err){
                        res.status(500).send({message: "error al guardar el usuario"});
                    }else{
                        if(!usuarioGuardado){
                            res.status(500).send({message: "no se ha guardado el usuario"});
                        }else{
                            res.status(200).send({usuario: usuarioGuardado});
                            console.log(usuarioGuardado);
                        }
                    }
                });
            } else {
                res.status(200).send({message: 'todos los campos son obligatorios'});
            }
        });
    // }else{
    //     res.status(500).send({message: "introduce la contrasena"})
    // }
}

function login (req, res){
    let parametros = req.body;
    let email = parametros.email;
    let clave = parametros.clave;

    Usuario.findOne({email: email.toLowerCase()}, (err, usuario)=>{
        if(err) {
            res.status(200).send({message: "Error en la busqueda"});
        } else {
            if(!usuario) {
                res.status(400).send({message: `credenciales invalidas 1`});
            } else {
                // comprobar contrasena
                bcrypt.compare(clave, usuario.clave, (err, result)=>{
                    if(result) {
                        // devolver los datos del usuario logueado
                        if(parametros.gethash){
                            // devolver token de jwt
                            res.status(200).send({
                                usuario: usuario,
                                token: jwt.crearTokent(usuario)
                            });
                        }else{
                            res.status(200).send({usuario});
                        }
                    } else {
                        res.status(400).send({message: `credenciales invalidas 2`});
                    }
                });
            }
        }
    });
}

function actualizar(req, res) {
    let idUsuario = req.params.id;
    let un_usuario = req.body; 
    
    // seguridad - verificar que el usuario logueado es el mismo que el que se actualiza
    if (req.user.sub != idUsuario) {
        return res.status(500).send({ message: `Error al actualizar el usuario. 
        No hay autorizacion para actualizar este usuario
        ${req.user.sub} != ${idUsuario}
        `});
    }
    
    let usuario = {"nombre": un_usuario.nombre, "apellido" : un_usuario.apellido, "email":un_usuario.email };
    if(un_usuario.clave!= null){
        usuario.clave = un_usuario.clave;
    }
    
    if (usuario.clave != null){
        bcrypt.hash(usuario.clave,null,null, function(err, hash){
            usuario.clave = hash;
            // guardar datos
            Usuario.findOneAndUpdate({_id : idUsuario}, usuario, (err, usuarioActualizado) => {
                if(err){
                    res.status(500).send({ message: 'Error al actualizar el usuario. '+err});
                } else {
                    if(!usuarioActualizado) {
                        res.status(404).send({message: 'El usuario no a podido ser actualizado'});
                    } else {
                        res.status(200).send({usuario: usuarioActualizado});
                    }
                }
            });
        });
    } else {
        // guardar datos
        Usuario.findOneAndUpdate({_id : idUsuario}, usuario, (err, usuarioActualizado) => {
            if(err){
                res.status(500).send({ message: 'Error al actualizar el usuario. '+err});
            } else {
                if(!usuarioActualizado) {
                    res.status(404).send({message: 'El usuario no a podido ser actualizado'});
                } else {
                    res.status(200).send({usuario: usuarioActualizado});
                }
            }
        });
    }
}

function subirImagen(req, res) {
    var idUsuario = req.params.id;
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
            Usuario.findOneAndUpdate({_id : idUsuario}, {imagen: nombreArchivo}, (err, usuarioActualizado) => {
                if(err) {
                    res.status(404).send({message: 'No se pudo actualizar la imagen'});
                } else {
                    res.status(200).send({usuario: usuarioActualizado});
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
    let imagen = './subidas/usuarios/'+archivo_imagen;
    fs.exists(imagen, (exist) => {
        if(exist){
            res.status(200).sendFile(path.resolve(imagen));
        } else {
            res.status(200).send({message: 'fichero no existe'});
        }
    });
}

module.exports = {
    guardar,
    login,
    actualizar,
    subirImagen,
    obtenerImagen
};
