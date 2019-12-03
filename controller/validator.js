const { check, sanitizeBody } = require('express-validator');

module.exports = {
  crearCuenta: [
    check('confirmar').notEmpty().withMessage('El password confirmado no puede ir vacio'),
  ]
}