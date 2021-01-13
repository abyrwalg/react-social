const fs = require("fs");

const User = require("../models/User");
const validator = require("../utils/validateForm");

exports.getLoggedUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ message: "Success", data: user.header });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.getUserDataById = async (req, res) => {
  try {
    let user = await User.findOne({ "regInfo.uid": req.params.id });
    if (!user) {
      res.status(404).json({ message: "Такого пользователя не существует" });
    }
    user = user.toObject();
    delete user.regInfo.password;
    delete user.__v;
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
};

exports.updatePersonalData = async (req, res) => {
  const update = {};
  for (const key in req.body) {
    update[key] = req.body[key].value;
  }
  const validateForm = validator.validatePersonalData(update);
  if (validateForm.error) {
    return res.status(400).json({
      message: "Неправильные данные формы",
      error: validateForm.error,
    });
  }
  try {
    await User.updateOne({ _id: req.user.id }, { personalData: update });
    res.status(200).json({ message: "Success maybe" });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.updateMainData = async (req, res) => {
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
      message: "Неправильные данные формы",
      error: validateForm.error,
    });
  }

  try {
    const user = await User.findById(req.user.id);
    user.header = { ...user.header, ...updateHeader };
    user.mainInfo = updateMainInfo;
    /* await User.updateOne(
      { _id: req.user.id },
      { header: updateHeader, mainInfo: updateMainInfo }
    ); */
    await user.save();
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.updateCareer = async (req, res) => {
  const validateForm = validator.validateCareer(req.body);
  if (validateForm.error) {
    return res.status(400).json({
      message: "Неправильные данные формы",
      error: validateForm.error,
    });
  }

  try {
    await User.updateOne({ _id: req.user.id }, { career: req.body });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.updateEducation = async (req, res) => {
  try {
    const typeKeys = { school: "Школа", higher: "Вуз" };
    const institutionType = typeKeys[req.headers.institution];
    const user = await User.findById(req.user.id);
    const saveWithoutChanges = user.education.filter(
      (element) => element.type !== institutionType
    );
    const updatedEducation = [...saveWithoutChanges, ...req.body];
    const validateForm = validator.validateEducation(updatedEducation);
    if (validateForm.error) {
      return res.status(400).json({
        message: "Неправильные данные формы",
        error: validateForm.error,
      });
    }
    await User.updateOne({ _id: req.user.id }, { education: updatedEducation });
    res.status(200).json({
      message: "Success",
      data: updatedEducation.filter(
        (element) => element.type === institutionType
      ),
    });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  const validateForm = validator.validateStatus(req.body);
  if (validateForm.error) {
    return res.status(400).json({
      message: "Неправильные данные",
      error: validateForm.error,
    });
  }

  try {
    const user = await User.findById(req.user.id);
    const updateHeader = { ...user.header, status: req.body.status };
    await User.updateOne({ _id: req.user.id }, { header: updateHeader });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.updateAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "error" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (user.header.avatar !== "") {
      console.log("Debugging");
      fs.unlink(user.header.avatar, async (err) => {
        if (err) {
          res.status(400).json({
            message: "Что-то пошло не так, попробуйте снова",
            error: err.message,
          });
        }
      });
    }
    user.header.avatar = req.file.path;
    await user.save();
    res.status(200).json({ message: "Success", avatar: req.file.path });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    fs.unlink(user.header.avatar, async (err) => {
      if (err) {
        res.status(400).json({
          message: "Что-то пошло не так, попробуйте снова",
          error: err.message,
        });
      } else {
        user.header.avatar = "";
        await user.save();
        res.status(200).json({ message: "Success" });
      }
    });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};
