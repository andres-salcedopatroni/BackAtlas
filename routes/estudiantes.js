var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const schema_estudiantes=require('../schemas/schema_estudiantes');
const estudiantes = mongoose.model('Estudiantes', schema_estudiantes,'Estudiantes');

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

router.post('/agregar', function(req, res, next) {
  const pedido=req.body
  const e=new estudiantes({
    nombre: pedido.nombre, 
    usuario: pedido.usuario,
    codigo: pedido.codigo,
    correo: pedido.correo,
    celular: pedido.celular,});
  e.save();
  res.json({e});
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
