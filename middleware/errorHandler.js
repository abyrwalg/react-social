/* eslint-disable complexity */
const AppError = require('../utils/appError');

function handleCastErrorDB(error) {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(error) {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(error) {
  const errors = Object.values(error.errors).map((err) => err.message);
  const message = `Invalid input data. ${errors.join('. ')}.`;
  return new AppError(message, 400);
}

function sendError(error, res) {
  return res.status(error.statusCode).json({
    status: error.status || 'error',
    message: error.message,
  });
}

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  console.error('ERROR', error);
  if (error.name === 'CastError') {
    const customError = handleCastErrorDB(error);
    return sendError(customError, res);
  }
  if (error.code === 11000) {
    const customError = handleDuplicateFieldsDB(error);
    return sendError(customError, res);
  }
  if (error.name === 'ValidationError') {
    const customError = handleValidationErrorDB(error);
    return sendError(customError, res);
  }
  return sendError(error, res);
};
