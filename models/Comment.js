const { ObjectId } = require('mongodb');
const { Schema, model } = require('mongoose');

const schema = new Schema({
  parent: { type: ObjectId, required: true },
  author: { type: ObjectId, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  likes: [ObjectId],
});

module.exports = model('Comment', schema);
