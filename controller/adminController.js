const Grupos = require('../models/Grupos');

module.exports = {
  panelAdministracion: async (req, res) => {
    const grupos = await Grupos.findAll({ where: { usuarioId: req.user.id } });
    
    res.render('administracion', {
      pageName: 'Panel de Administración',
      grupos
    })
  }
}