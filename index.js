'use strict'

var mongoose = require('mongoose'); 
var app = require('./app');
var port = process.env.PORT || 3977;

const config = {
    autoIndex: false,
    useNewUrlParser: true,
};
mongoose.connect('mongodb://localhost:27017/gestion-album',config).
then(()=> {
        console.log("conexion satisfactoria con la bd");
        app.listen(port, function(){
                console.log('servidor corriendo en http://localhost:'+port);
        })
}).
catch(err => { 
        console.log(err);
});