module.exports = {
  formCrearCuenta: (req, res) => {
    res.render('crear-cuenta', {
      pageName: 'Crear tu cuenta'
    });
  }
}