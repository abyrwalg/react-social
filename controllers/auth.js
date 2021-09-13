/* eslint-disable node/exports-style */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

const User = require('../models/User');
const validator = require('../utils/validateForm');
const catchAsync = require('../utils/catchAsync');

async function createAndSendTokens(user, statusCode, res) {
  const token = jwt.sign(
    { id: user._id, name: user.header.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  const refreshToken = randToken.uid(255);
  user.refreshToken = refreshToken;
  await user.save();

  user.regInfo.password = undefined;

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
}

exports.register = catchAsync(async (req, res) => {
  const validateForm = validator.validateRegistration(req.body);
  if (validateForm.error) {
    res.status(400).json({
      message: 'Неправильные данные формы',
      error: validateForm.error,
    });
  }

  const candidate = await User.findOne({ 'regInfo.email': req.body.email });

  if (candidate) {
    return res.status(400).json({ message: 'Этот email уже используется' });
  }

  const lastUser = await User.find().sort('-regInfo.uid').limit(1);
  let lastUid = 0;
  if (lastUser.length > 0) {
    lastUid = lastUser[0].regInfo.uid;
  }

  // const hashedPassword = await bcrypt.hash(req.body.password, 12);

  const user = new User({
    regInfo: {
      email: req.body.email,
      password: req.body.password,
      uid: lastUid + 1,
    },
    header: { name: req.body.name, surname: req.body.surname },
    mainInfo: {
      birthdate: req.body.birthdate,
    },
  });
  await user.save();

  createAndSendTokens(user, 201, res);
});

exports.login = catchAsync(async (req, res) => {
  const validateForm = validator.validateLogin(req.body);
  if (validateForm.error) {
    res.status(400).json({
      message: 'Неправильные данные формы',
      error: validateForm.error,
    });
  }

  const user = await User.findOne({ 'regInfo.email': req.body.email }).select(
    '+regInfo.password'
  );
  if (!user) {
    return res.status(400).json({ message: 'Неверный email или пароль' });
  }

  const checkPassword = await bcrypt.compare(
    req.body.password,
    user.regInfo.password
  );

  if (!checkPassword) {
    return res.status(400).json({ message: 'Неверный email или пароль' });
  }

  /*  const token = jwt.sign(
    { id: user._id, name: user.header.name },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = randToken.uid(255);
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    message: 'Success',
    token,
    uid: user.regInfo.uid,
    id: user._id,
    name: user.header.name,
    expires: Date.now() + 900 * 1000,
    refreshToken,
  }); */
  createAndSendTokens(user, 200, res);
});

exports.refreshToken = catchAsync(async (req, res) => {
  const user = await User.findById(req.body.userId);

  if (!user || user.refreshToken !== req.cookies.refreshToken) {
    res.status(401).json({ key: 'error.token-expired' });
    return;
  }

  /* const token = jwt.sign(
    { id: user._id, name: user.header.name },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = randToken.uid(255);
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    message: 'Success',
    token,
    uid: user.regInfo.uid,
    id: user._id,
    name: user.header.name,
    expires: Date.now() + 900 * 1000,
    refreshToken,
  }); */

  createAndSendTokens(user, 200, res);
});
