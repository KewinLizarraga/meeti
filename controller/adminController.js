module.exports = {
  panelAdministracion: (req, res) => {
    res.render('administracion', {
      pageName: 'Panel de Administración'
    })
  }
}