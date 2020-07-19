const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { MongoEndPoint } = require('./keys/mongoKeys');

const app = express();

app.use(bodyParser.json());

// cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// routes

// error handler
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

// connect to mongoose
mongoose
  .connect(MongoEndPoint)
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));