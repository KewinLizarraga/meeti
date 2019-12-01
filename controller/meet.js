module.exports = {
    inicio: (req, res) => {
        res.render('home');
    },
    crearCuenta: (req ,res) => {
        res.render('crear-cuenta');
    }
}