const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// const basicAuth = require("./middlewares/basicAuth");
const errorsHandler = require('./middlewares/errors');

const routes = require('./routes/index');
// const routesAdmin = require('./routes/admin');

const app = express();

app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json({ limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// app.use(basicAuth )

// app.use('/admin/', cors(), routesAdmin);

// app.use('/api/', basicAuth(),  routes);
app.use('/',  routes);

// app.use(require('./middlewares/error'))

app.use(errorsHandler.notFound);
app.use(errorsHandler.catchErrors);

module.exports = app;
