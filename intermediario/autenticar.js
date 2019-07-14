'use strict';
/*jshint node:true */
/*esversion : 6*/

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave-secreta';

exports.asegurarAut = function(req, res, next){
    if(!req.headers.authorization) {
        return res.status(403).send({message: 'no tiene la cabecera de autenticacion'});
    }
    var token = req.headers.authorization.replace(/["']+/g,'');
    var payload = null;
    try{
        payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'El token ha expirado'});
        }
    }catch(ex){
        // console.log(ex);
        return res.status(404).send({message: 'El token no es valido'});
    }
    req.user = payload;
    next();
};