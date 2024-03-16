var express = require('express');
var router = express.Router();
//Modulos
const axios = require('axios');
const mongoose = require('mongoose');
//Mongo
const schema_estudiantes=require('../schemas/schema_estudiantes');
const schema_tweets=require('../schemas/schema_tweets');
const estudiantes = mongoose.model('Estudiantes', schema_estudiantes,'Estudiantes');
const tweets = mongoose.model('Tweets', schema_tweets,'Tweets');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/mostrar', async function(req, res, next) {
  try{
  const e=await estudiantes.find({});
  res.json(e);}
  catch{}
});

router.get('/obtener/:usuario', async function(req, res, next) {
  try{
  const usuario=req.params.usuario;
  const e=await estudiantes.findOne({usuario:usuario});
  const t=await tweets.find({usuario:usuario}).sort({fecha: -1});
  res.json({"estudiante":e,"tweets":t});}
  catch{}
});

router.post('/agregar', 
  async function(req, res, next) {
    const pedido = req.body;
    try{
      const e = new estudiantes({
        nombre: pedido.nombre, 
        usuario: pedido.usuario,
        codigo: pedido.codigo,
        correo: pedido.correo,
        celular: pedido.celular,
        escuela: pedido.escuela
      });
      await e.save();
      res.json({'mensaje':1});
    }
    catch(error){
      console.log(error)
      res.status(400).json({'mensaje':'Uno de los valores de los campos ya ha sido registrado:'+error})
    };
  }
);

router.delete('/eliminar', async function(req, res, next) {
  try{
    const pedido=req.body;
    var eliminados=0;
    for (const e of pedido.eliminar){
      var num = await estudiantes.deleteMany({usuario: e});
      eliminados=num.deletedCount+eliminados;
    }
    res.json({"eliminados":eliminados});
  }
  catch(error){
    res.status(500).send(error);
  }
  console.log("Termino");
});

module.exports = router;
