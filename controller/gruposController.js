const { sanitizeBody } = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
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

    if (req.file) {
      grupo.imagen = req.file.filename;
    }

    try {
      await Grupos.create(grupo);
      req.flash('exito', 'Se ha creado el grupo correctamente');
      res.redirect('/administracion');
    } catch (error) {
      const erroresSequelize = error.errors.map(err => err.message);
      req.flash('error', erroresSequelize);
      res.redirect('/nuevo-grupo');
    }
  },
  formEditarGrupo: async (req, res, next) => {
    // Multiples consultas
    const consultas = [];
    consultas.push(Grupos.findByPk(req.params.grupoId));
    consultas.push(Categorias.findAll());
    const [grupo, categorias] = await Promise.all(consultas);

    res.render('editar-grupo', {
      pageName: `Editar Grupo: ${grupo.nombre}`,
      grupo,
      categorias
    });
  },
  editarGrupo: async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });

    if (!grupo) {
      req.flash('error', 'Operación no válida');
      res.redirect('/administracion');
      return next();
    }

    const { nombre, descripcion, categoria, url } = req.body;

    grupo.nombre = nombre;
    grupo.descripcion = descripcion;
    grupo.categoriaId = categoria;
    grupo.url = url;

    await grupo.save();
    req.flash('exito', 'Cambios guardados exitosamente');
    res.redirect('/administracion');
  },
  formEditarImagen: async (req, res) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });

    res.render('imagen-grupo', {
      pageName: `Editar imagen grupo: ${grupo.nombre}`,
      grupo
    });
  },
  editarImagen: async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });

    if (!grupo) {
      req.flash('error', 'Operación no válida');
      res.redirect('/iniciar-sesion');
      return next();
    }
    // if (req.file) console.log(req.file.filename);
    // if (grupo.imagen) console.log(grupo.imagen);
    if (req.file && grupo.imagen) {
      const imagenAntPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
      fs.unlink(imagenAntPath, (err) => {
        if (err) console.log(err);
        return;
      });
    }

    if (req.file) grupo.imagen = req.file.filename;

    await grupo.save();
    req.flash('exito', 'Cambios almacenados correctamente');
    res.redirect('/administracion');
  },
  formEliminarGrupo: async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });

    if (!grupo) {
      req.flash('error', 'Operación no válida');
      res.redirect('/administracion');
      return next();
    }

    res.render('eliminar-grupo', {
      pageName: `Eliminar grupo: ${grupo.nombre}`
    })
  },
  eliminarGrupo: async (req, res, next) => {
    const grupo = await Grupos.findOne({ where: { id: req.params.grupoId, usuarioId: req.user.id } });

    if (!grupo) {
      req.flash('error', 'Operación no válida');
      res.redirect('/administracion');
      return next();
    }

    if (grupo.imagen) {
      const imagenAntPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
      fs.unlink(imagenAntPath, (err) => {
        if (err) console.log(err);
        return;
      });
    }

    await Grupos.destroy({ where: { id: req.params.grupoId } });

    req.flash('exito', 'Grupo eliminado');
    res.redirect('/administracion');
  },
  subirImagen: (req, res, next) => {
    upload(req, res, function (error) {
      if (error) {
        if (error instanceof multer.MulterError) {
          if (error.code === 'LIMIT_FILE_SIZE') {
            req.flash('error', 'El archivo es muy grande');
          } else {
            req.flash('error', error.message);
          }
        } else if (error.hasOwnProperty('message')) {
          req.flash('error', error.message);
        }
        res.redirect('back');
        return;
      } else {
        next();
      }
    })
  },
}

const configuracionMulter = {
  limits: { fileSize: 100000 },
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, next) => {
      next(null, __dirname + '/../public/uploads/grupos/');
    },
    filename: (req, file, next) => {
      const extension = file.mimetype.split('/')[1];
      next(null, `${shortid.generate()}.${extension}`);
    }
  }),
  fileFilter: (req, file, next) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      next(null, true);
    } else {
      next(new Error('Formato no válido'), false);
    }
  }
}

const upload = multer(configuracionMulter).single('imagen');