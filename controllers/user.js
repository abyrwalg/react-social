/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const fs = require('fs');

const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const validator = require('../utils/validateForm');

exports.getLoggedUserData = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ message: 'Success', data: user.header });
});

exports.getUserDataById = catchAsync(async (req, res) => {
  let user = await User.findOne({ 'regInfo.uid': req.params.id });
  if (!user) {
    res.status(404).json({ message: 'Такого пользователя не существует' });
  }
  user = user.toObject();
  delete user.regInfo.password;
  delete user.__v;
  res.json(user);
});

exports.updatePersonalData = catchAsync(async (req, res) => {
  const update = {};
  for (const key in req.body) {
    update[key] = req.body[key].value;
  }
  const validateForm = validator.validatePersonalData(update);
  if (validateForm.error) {
    return res.status(400).json({
      message: 'Неправильные данные формы',
      error: validateForm.error,
    });
  }

  await User.updateOne({ _id: req.user.id }, { personalData: update });
  res.status(200).json({ message: 'Success maybe' });
});

exports.updateMainData = catchAsync(async (req, res) => {
  const updateHeader = {
    name: req.body.name.value,
    surname: req.body.surname.value,
  };
  const updateMainInfo = {
    birthdate: req.body.birthdate.value,
    country: req.body.country.value,
    city: req.body.city.value,
  };

  const formToValidate = { ...updateHeader, ...updateMainInfo };

  const validateForm = validator.validateMainData(formToValidate);
  if (validateForm.error) {
    return res.status(400).json({
      message: 'Неправильные данные формы',
      error: validateForm.error,
    });
  }

  const user = await User.findById(req.user.id);
  user.header = { ...user.header, ...updateHeader };
  user.mainInfo = updateMainInfo;
  /* await User.updateOne(
      { _id: req.user.id },
      { header: updateHeader, mainInfo: updateMainInfo }
    ); */
  await user.save();
  res.status(200).json({ message: 'Success' });
});

exports.updateCareer = catchAsync(async (req, res) => {
  const validateForm = validator.validateCareer(req.body);
  if (validateForm.error) {
    return res.status(400).json({
      message: 'Неправильные данные формы',
      error: validateForm.error,
    });
  }

  await User.updateOne({ _id: req.user.id }, { career: req.body });
  res.status(200).json({ message: 'Success' });
});

exports.updateEducation = catchAsync(async (req, res) => {
  const typeKeys = { school: 'Школа', higher: 'Вуз' };
  const institutionType = typeKeys[req.headers.institution];
  const user = await User.findById(req.user.id);
  const saveWithoutChanges = user.education.filter(
    (element) => element.type !== institutionType
  );
  const updatedEducation = [...saveWithoutChanges, ...req.body];
  const validateForm = validator.validateEducation(updatedEducation);
  if (validateForm.error) {
    return res.status(400).json({
      message: 'Неправильные данные формы',
      error: validateForm.error,
    });
  }
  await User.updateOne({ _id: req.user.id }, { education: updatedEducation });
  res.status(200).json({
    message: 'Success',
    data: updatedEducation.filter(
      (element) => element.type === institutionType
    ),
  });
});

exports.updateStatus = catchAsync(async (req, res) => {
  const validateForm = validator.validateStatus(req.body);
  if (validateForm.error) {
    return res.status(400).json({
      message: 'Неправильные данные',
      error: validateForm.error,
    });
  }

  const user = await User.findById(req.user.id);
  const updateHeader = { ...user.header, status: req.body.status };
  await User.updateOne({ _id: req.user.id }, { header: updateHeader });
  res.status(200).json({ message: 'Success' });
});

exports.updateAvatar = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'error' });
  }

  const user = await User.findById(req.user.id);
  if (user.header.avatar !== '') {
    fs.unlink(user.header.avatar, async (err) => {
      if (err) {
        res.status(400).json({
          message: 'Что-то пошло не так, попробуйте снова',
          error: err.message,
        });
      }
    });
  }
  user.header.avatar = req.file.path;
  await user.save();
  res.status(200).json({ message: 'Success', avatar: req.file.path });
});

exports.deleteAvatar = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);

  fs.unlink(user.header.avatar, async (err) => {
    if (err) {
      res.status(400).json({
        message: 'Что-то пошло не так, попробуйте снова',
        error: err.message,
      });
    } else {
      user.header.avatar = '';
      await user.save();
      res.status(200).json({ message: 'Success' });
    }
  });
});
