'use strict'

var bcrypt = require('bcrypt-nodejs')
var Usuario = require('../modelos/usuario')

function api(req, res){
    res.status(200).send({
        message: "probando api"
    });
}

function guardar(req, res){
    var usuario = new Usuario();

    var parametros = req.body;

    console.log(parametros)

    usuario.nombre = parametros.nombre;
    usuario.apellido = parametros.apellido;
    usuario.email = parametros.email;
    usuario.rol = 'ROL_ADMINs';
    usuario.imagen = 'null';

    if(parametros.clave === 'admin'){
        // encriptar contrasena y guardar datos
        bcrypt.hash(parametros.clave,null,null, function(err, hash){
            usuario.clave = hash
            if(usuario.nombre != null && usuario.apellido != null && usuario.email != null){
                // guardar datos
                usuario.save((err,usuarioGuardado) => {
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
                })
            } else {
                res.status(200).send({message: 'todos los campos son obligatorios'});
            }
        });
    }else{
        res.status(500).send({message: "introduce la contrasena"})
    }
}

module.exports = {
    api,
    guardar
};