const { sanitizeBody } = require('express-validator');
const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');

module.exports = {
  formNuevoGrupo: async (req, res) => {
    const categorias = await Categorias.findAll();

    res.render('nuevo-grupo', {
      pageName: 'Crea un nuevo grupo',
      categorias
    })
  },
  crearGrupo: async (req, res) => {
    sanitizeBody('nombre');
    sanitizeBody('url');

    const grupo = req.body;
    grupo.usuarioId = req.user.id;
    grupo.categoriaId = grupo.categoria;

    try {
      await Grupos.create(grupo);
      req.flash('exito', 'Se ha creado el grupo correctamente');
      res.redirect('/administracion');
    } catch (error) {
      const erroresSequelize = error.errors.map(err => err.message);
      req.flash('error', erroresSequelize);
      res.redirect('/nuevo-grupo');
    }
  }
}