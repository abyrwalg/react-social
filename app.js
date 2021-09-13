/* eslint-disable no-process-exit */
const express = require('express');
// const cors = require("cors");
const dotenv = require('dotenv-flow');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const errorHandler = require('./middleware/errorHandler');

const app = express();

dotenv.config();

app.use(helmet());

// Middleware
app.use(express.json({ extended: true, limit: '10kb' }));
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());

// Data sanitization against NoSQL query injections and XSS
app.use(mongoSanitize());
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api', limiter);

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
