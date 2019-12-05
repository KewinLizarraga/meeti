require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const passport = require('./config/passport');
const router = require('./routes');
const db = require('./config/db');
require('./models/Usuarios');

db.sync()
  .then(() => console.log('La conexión se ha establecido con éxito.'))
  .catch(err => console.log('No se puede conectar a la base de datos', err));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));

app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware
app.use((req, res, next) => {
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

app.use(router);

app.listen(process.env.PORT, () => console.log(`Meeti run in ${process.env.PORT}`));