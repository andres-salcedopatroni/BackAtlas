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
  const usuario=req.params.usuario
  const e=await estudiantes.findOne({usuario:usuario});
  res.json(e);}
  catch{}
});

router.post('/agregar', function(req, res, next) {
  
  const pedido=req.body;
  var respuesta;
  axios.post("https://andressalcedo2023.pythonanywhere.com/tweets",{"usuario": pedido.usuario})
  .then(res => {
    const e=new estudiantes({
      nombre: pedido.nombre, 
      usuario: pedido.usuario,
      codigo: pedido.codigo,
      correo: pedido.correo,
      celular: pedido.celular,});
    e.save();
    for (const m of res){
      const t=new tweets({
        mensaje: m.texto, 
        fecha: m.fecha,
        usuario: pedido.usuario
      });
      t.save();
    }
    respuesta="Realizado"
  })
  .catch(err => {
    respuesta=err
  });
  res.json({'mensaje':respuesta});
});

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
});

module.exports = router;
