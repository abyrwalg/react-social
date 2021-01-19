const ObjectId = require("mongoose").Types.ObjectId;

const validateComment = (comment) => {
  console.log(comment);
  if (!ObjectId.isValid(comment.parent)) {
    return false;
  } else {
    return true;
  }
};

module.exports = validateComment;
