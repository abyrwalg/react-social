const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const validator = require("../utils/validateForm");

exports.register = async (req, res) => {
  const validateForm = validator.validateRegistration(req.body);
  if (validateForm.error) {
    res.status(400).json({
      message: "Неправильные данные формы",
      error: validateForm.error,
    });
  }

  try {
    const candidate = await User.findOne({ "regInfo.email": req.body.email });

    if (candidate) {
      return res.status(400).json({ message: "Этот email уже используется" });
    }

    let lastUser = await User.find().sort("-regInfo.uid").limit(1);
    let lastUid = 0;
    if (lastUser.length > 0) {
      lastUid = lastUser[0].regInfo.uid;
    }
    console.log(lastUid);
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = new User({
      regInfo: {
        email: req.body.email,
        password: hashedPassword,
        uid: lastUid + 1,
      },
      header: { name: req.body.name, surname: req.body.surname },
      mainInfo: {
        birthdate: req.body.birthdate,
      },
    });
    await user.save();

    res.status(201).json({ message: "Пользователь создан" });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const validateForm = validator.validateLogin(req.body);
  if (validateForm.error) {
    res.status(400).json({
      message: "Неправильные данные формы",
      error: validateForm.error,
    });
  }
  try {
    const user = await User.findOne({ "regInfo.email": req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.regInfo.password
    );

    if (!checkPassword) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.header.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "Success",
      token,
      uid: user.regInfo.uid,
      name: user.header.name,
      expires: Date.now() + 3600 * 1000,
    });
  } catch (error) {
    res.status(400).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
};
