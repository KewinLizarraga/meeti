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
router.post('/nuevo-grupo', gruposController.subirImagen, gruposController.crearGrupo);
router.get('/editar-grupo/:grupoId', authController.usuarioAuntenticado, gruposController.formEditarGrupo);
router.post('/editar-grupo/:grupoId', authController.usuarioAuntenticado, gruposController.editarGrupo);
router.get('/imagen-grupo/:grupoId', authController.usuarioAuntenticado, gruposController.formEditarImagen);
router.post('/imagen-grupo/:grupoId', authController.usuarioAuntenticado, gruposController.subirImagen, gruposController.editarImagen);
router.get('/eliminar-grupo/:grupoId', authController.usuarioAuntenticado, gruposController.formEliminarGrupo);
router.post('/eliminar-grupo/:grupoId', authController.usuarioAuntenticado, gruposController.eliminarGrupo);

module.exports = router;