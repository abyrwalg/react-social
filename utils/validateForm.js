const Joi = require('joi');

const validateRegistration = (formData) => {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    surname: Joi.string().required().trim(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    passwordConfirm: Joi.string().required().valid(Joi.ref('password')),
    birthdate: Joi.date().required(),
  });
  return schema.validate(formData);
};

const validateLogin = (formData) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(formData);
};

const validatePersonalData = (formData) => {
  const schema = Joi.object({
    interests: Joi.string().max(512).allow(null, ''),
    favoriteBooks: Joi.string().max(512).allow(null, ''),
    favoriteMovies: Joi.string().max(512).allow(null, ''),
    favoriteMusic: Joi.string().max(512).allow(null, ''),
    about: Joi.string().max(512).allow(null, ''),
  });
  return schema.validate(formData);
};

const validateMainData = (formData) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().min(1).max(120),
    surname: Joi.string().required().trim().min(1).max(120),
    birthdate: Joi.date().required(),
    country: Joi.string().max(120).allow(null, ''),
    city: Joi.string().max(120).allow(null, ''),
  });
  return schema.validate(formData);
};

const validateCareer = (formData) => {
  const schema = Joi.array().items({
    workplace: Joi.string().trim().required().max(120),
    city: Joi.string().trim().max(120).allow(null, ''),
    position: Joi.string().trim().max(120).allow(null, ''),
    yearStart: Joi.string().trim().min(4).max(4).allow(null, ''),
    yearEnd: Joi.string().trim().min(4).max(4).allow(null, ''),
  });
  return schema.validate(formData);
};

const validateEducation = (formData) => {
  const schema = Joi.array().items({
    type: Joi.string().trim().required().allow('Школа', 'Вуз'),
    name: Joi.string().trim().required().max(120),
    city: Joi.string().trim().max(120).allow(null, ''),
    status: Joi.string().trim().max(120).allow(null, ''),
    specialty: Joi.string().trim().max(120).allow(null, ''),
    yearStart: Joi.string().trim().min(4).max(4).allow(null, ''),
    yearEnd: Joi.string().trim().min(4).max(4).allow(null, ''),
  });
  return schema.validate(formData);
};

const validateStatus = (formData) => {
  const schema = Joi.object({
    status: Joi.string().trim().max(120).allow(null, ''),
  });
  return schema.validate(formData);
};

module.exports = {
  validateRegistration,
  validateLogin,
  validatePersonalData,
  validateMainData,
  validateCareer,
  validateEducation,
  validateStatus,
};
