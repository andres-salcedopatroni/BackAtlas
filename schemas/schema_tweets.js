const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema_tweets= new Schema(
    { 
        usuario: String,
        mensaje: String,
        fecha: Date
    });

module.exports=schema_tweets