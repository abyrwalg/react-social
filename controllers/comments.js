const Comment = require('../models/Comment');
const User = require('../models/User');
const validateComment = require('../utils/validateComment');

exports.postComment = async (req, res) => {
  if (!validateComment(req.body)) {
    return res.status(400).json({
      message: 'Что-то пошло не так, попробуйте снова',
      error: 'Ошибка валидации',
    });
  }

  try {
    const comment = new Comment({
      parent: req.body.parent,
      author: req.user.id,
      content: req.body.content,
      date: new Date(),
    });
    const author = await User.findById(req.user.id);
    const userName = `${author.header.name} ${author.header.surname}`;
    const { avatar } = author.header;
    const { uid } = author.regInfo;
    comment
      .save()
      .then(() => {
        const response = { ...comment._doc, userName, avatar, uid };
        res.status(201).json({ message: 'success', comment: response });
      })
      .catch((error) => {
        return res.status(400).json({
          message: 'Что-то пошло не так, попробуйте снова',
          error: error.message,
        });
      });
  } catch (error) {
    res.status(400).json({
      message: 'Что-то пошло не так, попробуйте снова',
      error: error.message,
    });
  }
};

exports.getCommentsByParentId = async (req, res) => {
  try {
    let comments = await Comment.find({ parent: req.params.id })
      .sort({ date: -1 })
      .lean();
    comments = await Promise.all(
      comments.map(async (comment) => {
        const author = await User.findById(comment.author);
        return {
          ...comment,
          userName: `${author.header.name} ${author.header.surname}`,
          uid: author.regInfo.uid,
          avatar: author.header.avatar,
        };
      })
    );
    res.status(200).json({ comments });
  } catch (error) {
    res.status(400).json({
      message: 'Что-то пошло не так, попробуйте снова',
      error: error.message,
    });
  }
};

exports.deletePostById = async (req, res) => {
  if (req.user.id !== req.body.author && req.user.id !== req.body.parent) {
    return res
      .status(401)
      .json({ message: 'Нельзя удалять чужие комментарии' });
  }

  try {
    await Comment.findOneAndDelete({ _id: req.body._id });
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(400).json({
      message: 'Что-то пошло не так, попробуйте снова',
      error: error.message,
    });
  }
};

exports.editComment = async (req, res) => {
  if (req.user.id !== req.body.author) {
    return res
      .status(401)
      .json({ message: 'Нельзя редактировать чужие комментарии' });
  }

  try {
    await Comment.findByIdAndUpdate(req.body._id, {
      content: req.body.content,
    });
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(400).json({
      message: 'Что-то пошло не так, попробуйте снова',
      error: error.message,
    });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.body.id);
    if (!comment.likes.includes(req.user.id)) {
      comment.likes.push(req.user.id);
      comment.save();
      res.status(201).json({ message: 'Success', likes: comment.likes });
    } else {
      const likeIndex = comment.likes.indexOf(req.user.id);
      comment.likes.splice(likeIndex, 1);
      comment.save();
      res.status(201).json({ message: 'Success', likes: comment.likes });
    }
  } catch (error) {
    res.status(400).json({
      message: 'Что-то пошло не так, попробуйте снова',
      error: error.message,
    });
  }
};
