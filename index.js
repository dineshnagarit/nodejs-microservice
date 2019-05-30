const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const handleResponse = require('./helpers/responseHandler');
const CusError = require('./helpers/cusError');
const responseType = require('./helpers/responseType');
const bodyParser = require('body-parser');
dotenv.config({ path: './configs/.env' });

mongoose.connect(`mongodb://${process.env.DB_DOMAIN}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{
    useNewUrlParser: true
  }
);

mongoose.connection.on('error', () => {
  console.log(`unable to connect to database: mongodb://${process.env.DB_DOMAIN}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

mongoose.set('useCreateIndex', true);
mongoose.Promise = Promise;

const app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Settings Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.options('*', (req, res) => res.status(201).end());

// Importing Routes
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let error = new CusError(responseType.NOT_FOUND, 'URL Not Found');
  logger.log(`warn`, req, res, `Requested URL [${req.url}] not found.`);
  next(error);
});

// error handler
app.use(handleResponse.handleError);

let server = app.listen(process.env.PORT, function () {
  let port = server.address().port;
  console.log(`service listening at port ${server.address().port}.`);
});  
