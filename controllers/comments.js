const Comment = require("../models/Comment");
const User = require("../models/User");
const validateComment = require("../utils/validateComment");

exports.postComment = async (req, res) => {
  if (!validateComment(req.body)) {
    return res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: "Ошибка валидации",
    });
  }

  try {
    const comment = new Comment({
      parent: req.body.parent,
      author: req.user.id,
      content: req.body.content,
      date: new Date(),
    });
    comment
      .save()
      .then(() => {
        res.status(201).json({ message: "success" });
      })
      .catch((error) => {
        return res.status(400).json({
          message: "Что-то пошло не так, попробуйте снова",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};

exports.getCommentsByParentId = async (req, res) => {
  try {
    let comments = await Comment.find({ parent: req.params.id }).lean();
    comments = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.author);
        return {
          ...comment,
          userName: user.header.name + " " + user.header.surname,
        };
      })
    );
    console.log(comments);
    res.status(200).json({ comments });
  } catch (error) {
    res.status(400).json({
      message: "Что-то пошло не так, попробуйте снова",
      error: error.message,
    });
  }
};
