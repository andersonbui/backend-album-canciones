'use strict';
/*jshint node:true */
/*jshint esversion: 6 */

var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../modelos/usuario');
var jwt = require('../servicios/jwt');

function api(req, res){
    res.status(200).send({
        message: "probando api"
    });
}

function guardar(req, res){
    var usuario = new Usuario();

    var parametros = req.body;

    console.log(parametros);

    usuario.nombre = parametros.nombre;
    usuario.apellido = parametros.apellido;
    usuario.email = parametros.email;
    usuario.rol = 'ROL_ADMINs';
    usuario.imagen = 'null';

    if(parametros.token === 'admin'){
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
                            res.status(200).send({message: "usuario guardado"});
                            console.log(usuarioGuardado);
                        }
                    }
                });
            } else {
                res.status(200).send({message: 'todos los campos son obligatorios'});
            }
        });
    }else{
        res.status(500).send({message: "introduce la contrasena"})
    }
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
    let datos_usuario = req.body;

    Usuario.findOneAndUpdate(idUsuario, datos_usuario, (err, usuarioActualizado) => {
        if(err){
            res.status(500).send({ message: 'Error al actualizar el usuario'});
        } else {
            if(!usuarioActualizado) {
                res.status(404).send({message: 'El usuario no a podido ser actualizado'});
            } else {
                res.status(200).send({usuario: usuarioActualizado});
            }
        }

    });

}

function subirImagen(req, res) {
    var idUsuario = req.params.id;
    var nombreArchivo = 'no subido ...';
    if (req.files){
        var rutaArchivo = req.files.image.path;
        let file_spli = rutaArchivo.split('/');
        if(file_spli.length == 1){
            file_spli = file_spli[0].split('\\')[2];
        } else {
            file_spli = file_spli[2];
        }
        let extension = rutaArchivo.split('\.')[1];
        if(extension == 'png' || extension == 'jpg' || extension == 'gif') {
            Usuario.findOneAndUpdate(idUsuario, {imagen: file_spli}, (err, usuarioActualizado) => {
                if(err) {
                    res.status(404).send({message: 'No se pudo actualizar la imagen'});
                } else {
                    res.status(200).send({usuario: usuarioActualizado});
                }
            });
        } else {
            res.status(200).send({message: 'Extension del archivo no valida'});
        }
        console.log(file_spli);
        console.log(extension);
    } else {
        res.status(200).send({message: 'No has subido ninguna imagen'});
    }
}

module.exports = {
    api,
    guardar,
    login,
    actualizar,
    subirImagen
};