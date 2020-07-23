const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Multer = require('multer');
// const upload = multer({ dest: 'uploads/' })

// middlewares
const logger = require('./middlewares/logger');

const { MongoEndPoint } = require('./keys/mongoKeys');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// initialize server
const server = express();

// initialize multer
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multer = Multer({
  storage: Multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

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
server.use('/profile', multer.single('pic'), profileRoutes);

// error handler
server.use((error, req, res, next) => {
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