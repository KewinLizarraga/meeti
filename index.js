require('dotenv').config({ path: 'variables.env' });
const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const path = require('path');

const router = require('./routes');

const app = express();

app.use(expressLayouts);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));
// Middleware
app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

app.use(router);

app.listen(process.env.PORT, () => console.log(`Meeti run in ${process.env.PORT}`));