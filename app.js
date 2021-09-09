/* eslint-disable no-process-exit */
const express = require('express');
// const cors = require("cors");
const dotenv = require('dotenv-flow');
const mongoose = require('mongoose');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const errorHandler = require('./utils/errorHandler');

const app = express();

dotenv.config();

// Middleware
app.use(express.json({ extended: true }));
app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// Route middlewares
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/comments', require('./routes/comments'));

app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} on this server`,
    404
  );
  // throw error;

  next(error);
});

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const server = app.listen(process.env.PORT, () => {
      console.log(`Server is up and running on port ${process.env.PORT}`);
    });

    process.on('unhandledRejection', (error) => {
      console.log(error.name, error.message);
      console.log('UNHANDLED REJECTION. Shutting down');
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (error) => {
      console.log(error.name, error.message);
      console.log('UNCAUGHT EXCEPTION. Shutting down');
      process.exit(1);
    });
  } catch (error) {
    // console.log('Что-то пошло не так:', error.message);
    // process.exit(1);
    throw new Error(error.message);
  }
}

start();
