const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// middlewares
const logger = require('./middlewares/logger');

const { MongoEndPoint } = require('./keys/mongoKeys');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');

// initialize server
const server = express();

server.use(bodyParser.json());

// cors
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// routes
server.use('/auth', authRoutes);
server.use('/user', userRoutes);
server.use('/profile', profileRoutes);

// error handler
server.use((error, req, res, next) => {
  console.log("Error has occured")
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
    server.listen(8080);
  })
  .catch(err => console.log(err));