const { ObjectId } = require('mongoose').Types;

const validateComment = (comment) => {
  console.log(comment);
  if (!ObjectId.isValid(comment.parent)) {
    return false;
  }
  return true;
};

module.exports = validateComment;
