const express = require('express');
const meet = require('../controller/meet');

const router = express.Router();

router.get('/', meet.inicio);
router.get('/crear-cuenta', meet.crearCuenta);

module.exports = router;