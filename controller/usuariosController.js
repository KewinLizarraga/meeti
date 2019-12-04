const { check, sanitizeBody, validationResult } = require('express-validator');
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

module.exports = {
  formCrearCuenta: (req, res) => {
    res.render('crear-cuenta', {
      pageName: 'Crear tu cuenta'
    });
  },
  crearCuenta: async (req, res) => {
    const usuario = req.body;
    await check('confirmar').equals(req.body.password).withMessage('El password es diferente').run(req);
    const errorExpress = validationResult(req);
    try {
      await Usuarios.create(usuario);
      const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;
      await enviarEmail.enviarEmail({
        usuario,
        url,
        subject: 'Confirmar tu cuenta de Meeti',
        archivo: 'confirmar-cuenta'
      });

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
  confirmarCuenta: async (req, res, next) => {
    const usuario = await Usuarios.findOne({ where: { email: req.params.correo } });
    
    if (!usuario) {
      req.flash('error', 'No existe esa cuenta');
      res.redirect('/crear-cuenta');
      return next();
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesión');
    res.redirect('/iniciar-sesion');
  },
  formIniciarSesion: (req, res) => {
    res.render('iniciar-sesion', {
      pageName: 'Iniciar Sesión'
    });
  }
}