const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_estudiantes = new Schema(
    { 
        nombre: String, 
        usuario: {type: String, unique: true, required: true },
        codigo: String,
        escuela: String,
        correo: {type: String, unique: true },
        celular: {type: Number, unique: true },
        fecha: Date
    });

module.exports=schema_estudiantes