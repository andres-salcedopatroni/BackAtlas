const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_estudiantes = new Schema(
    { 
        nombre: String, 
        usuario: String,
        codigo: String,
        correo: String,
        celular: Number,

    });

module.exports=schema_estudiantes