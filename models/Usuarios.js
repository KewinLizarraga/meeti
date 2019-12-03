const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const Usuarios = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: Sequelize.STRING(60),
  imagen: Sequelize.STRING(60),
  email: {
    type: Sequelize.STRING(30),
    allowNull: false,
    validate: {
      isEmail: { msg: 'Agrega un correo válido' }
    },
    unique: {
      args: true,
      msg: 'Usuario ya registrado'
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El password no puede ir vacio' }
    }
  },
  activo: {
    type: Sequelize.INTEGER(1),
    defaultValue: 0
  },
  tokenPassword: Sequelize.STRING,
  expiraToken: Sequelize.DATE
}, {
  hooks: {
    beforeCreate(usuario) {
      usuario.password = bcrypt.hashSync(usuario.password, 10)
    }
  }
});

Usuarios.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = Usuarios;