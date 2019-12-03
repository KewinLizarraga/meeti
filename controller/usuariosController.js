const { check, sanitizeBody, validationResult } = require('express-validator');
const Usuarios = require('../models/Usuarios');

module.exports = {
  formCrearCuenta: (req, res) => {
    res.render('crear-cuenta', {
      pageName: 'Crear tu cuenta'
    });
  },
  crearCuenta: async (req, res) => {
    const body = req.body;
    await check('confirmar').equals(req.body.password).withMessage('El password es diferente').run(req);
    const errorExpress = validationResult(req);
    try {
      await Usuarios.create(body);
      req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta');
      res.redirect('/iniciar-sesion');
    } catch (error) {
      const errorSequelize = error.errors.map(err => err.message);
      const errExp = errorExpress.errors.map(err => err.msg);
      const listaErrores = [...errorSequelize, ...errExp];

      req.flash('error', listaErrores);
      res.redirect('/crear-cuenta');
    }
  },
  formIniciarSesion: (req, res) => {
    res.render('iniciar-sesion', {
      pageName: 'Iniciar Sesión'
    });
  }
}