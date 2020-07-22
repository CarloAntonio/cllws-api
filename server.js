const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { MongoEndPoint } = require('./keys/mongoKeys');

const authRoutes = require('./routes/auth');

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
app.use('/auth', authRoutes);

// error handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// connect to mongoose
mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(MongoEndPoint, { useNewUrlParser: true })
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));