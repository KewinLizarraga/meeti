const express = require('express');
const homeController = require('../controller/homeController');
const usuariosController = require('../controller/usuariosController');

const router = express.Router();

router.get('/', homeController.home);
router.get('/crear-cuenta', usuariosController.formCrearCuenta);

module.exports = router;