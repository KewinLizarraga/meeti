const Grupos = require('../models/Grupos');

module.exports = {
  formNuevoMeeti: async (req, res) => {
    const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });
    
    console.log(grupos);
    
    res.render('nuevo-meeti', {
      pageName: 'Crear Nuevo Meeti',
      grupos
    })
  }
}