'use strict';

var mongoose = require('mongoose'); 
var app = require('./app');
var port = process.env.PORT || 3977;
var tunel = require('tunnel-ssh');

// conexion en db remota con tunel ssh
const config = {
    username: 'debian',
    host: '10.42.0.1',
    agent: process.env.SSH_AUTH_SOCK || '',
    port: 22,
    password: '@n50nauta',
    dstPort: '27017',
//     dstHost:'mongodb://localhost:27000/gestion-album',
    localhost: '127.0.0.1',
    localPort: 27000
};

const options = {
        autoIndex: false,
        useNewUrlParser: true,
        useFindAndModify: false
};

var server = tunel(config, (error, server) =>  {
        if(error){
                console.log("ssh connection error: "+ error);
                return;
        }
        mongoose.connect('mongodb://localhost:27000/gestion-album',
        options).
        then(()=> {
                console.log("conexion satisfactoria con la bd");
                app.listen(port, function(){
                        console.log('servidor corriendo en http://localhost:'+port);
                })
        })

});

// conexion en bd local
/*
mongoose.connect('mongodb://localhost:27017/gestion-album',config).
then(()=> {
        console.log("conexion satisfactoria con la bd");
        app.listen(port, function(){
                console.log('servidor corriendo en http://localhost:'+port);
        })
}).
catch(err => { 
        console.log(err);
});*/