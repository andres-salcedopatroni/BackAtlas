var express = require('express');
var router = express.Router();
//Modulos
const mongoose = require('mongoose');
//Mongo
const schema_estudiantes=require('../schemas/schema_estudiantes');
const schema_tweets=require('../schemas/schema_tweets');
const estudiantes = mongoose.model('Estudiantes', schema_estudiantes,'Estudiantes');
const tweets = mongoose.model('Tweets', schema_tweets,'Tweets');

router.get('/mostrar', async function(req, res, next) {
  try{
    var lista_estudiantes = await estudiantes.find({});
    var datos = [];
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth()-1);
    for(let estudiante of lista_estudiantes){
      var dato = {"nombre":estudiante.nombre,"usuario":estudiante.usuario}
      var lista_tweets = await tweets.find({usuario:estudiante.usuario}).sort({fecha: -1});
      var tweets_depresivos = 0;
      var cantidad = 0;
      var tweets_depresivos_mensual = 0;
      var cantidad_mensual = 0;
      for(let tweet of lista_tweets){
        if (tweet.estado == 1){
          tweets_depresivos = tweets_depresivos + 1;
          if(fecha < tweet.fecha)
            tweets_depresivos_mensual = tweets_depresivos_mensual + 1;      
        }
        cantidad = cantidad + 1;
        if(fecha < tweet.fecha)
          cantidad_mensual = cantidad_mensual + 1;
      }
      if(cantidad > 0){
        var porcentaje_depresivo = tweets_depresivos/cantidad;
        if(porcentaje_depresivo >= 0.5 && dato.estado == 1)
          dato.estado = 2; 
        else{
          if(porcentaje_depresivo < 0.5 && dato.estado == 1)
          dato.estado = 1; 
        }
        }    
      datos.push(dato);
    }
    res.json(datos);
  }
  catch(error){
    res.status(400).json({'mensaje':error});
  }
});

router.get('/obtener/:usuario', async function(req, res, next) {
  try{
    const usuario=req.params.usuario;
    const e=await estudiantes.findOne({usuario:usuario});
    const t=await tweets.find({usuario:usuario}).sort({fecha: -1});
    res.json({"estudiante":e,"tweets":t});}
  catch(error){
    res.status(400).json({'mensaje':error})
  }
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
      res.json({'mensaje':'Usuario agregado'});
    }
    catch(error){
      res.status(400).json({'mensaje':error});
    };
  }
);

router.delete('/eliminar', async function(req, res, next) {
  try{
    const pedido=req.body;
    await estudiantes.deleteMany({usuario: pedido.usuario});
    await tweets.deleteMany({usuario: pedido.usuario});
    res.json({"mensaje": "Estudiante eliminado"});
  }
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

router.put('/actualizar', async function(req, res, next) {
  try{
    const pedido=req.body;
    const e = await estudiantes.findOne({usuario:pedido.usuario});
    e.nombre = pedido.nombre;
    e.codigo = pedido.codigo;
    e.correo = pedido.correo;
    e.celular = pedido.celular;
    e.escuela = pedido.escuela;
    await e.save();
    res.json({"mensaje": "Estudiante actualizado"});
  }
  catch(error){
    res.status(400).json({'mensaje':error})
  }
});

module.exports = router;
