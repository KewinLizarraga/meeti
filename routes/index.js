const express = require('express');
const homeController = require('../controller/homeController');
const usuariosController = require('../controller/usuariosController');
const authController = require('../controller/authController');
const adminController = require('../controller/adminController');
const gruposController = require('../controller/gruposController');
const validator = require('../controller/validator');

const router = express.Router();

router.get('/', homeController.home);
router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta', validator.crearCuenta, usuariosController.crearCuenta);
router.get('/confirmar-cuenta/:correo', usuariosController.confirmarCuenta);
router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);

router.get('/administracion', authController.usuarioAuntenticado, adminController.panelAdministracion);

router.get('/nuevo-grupo', authController.usuarioAuntenticado, gruposController.formNuevoGrupo);
router.post('/nuevo-grupo', gruposController.crearGrupo);

module.exports = router;