const { Schema, model } = require('mongoose');

const schema = new Schema({
  regInfo: {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    uid: { type: Number, required: true, unique: true },
  },
  header: {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    status: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  mainInfo: {
    birthdate: {
      type: Date,
      required: true,
    },
    country: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
  },
  career: { type: Array },
  education: { type: Array },
  personalData: {
    interests: {
      type: String,
      default: '',
    },
    favoriteBooks: {
      type: String,
      default: '',
    },
    favoriteMovies: {
      type: String,
      default: '',
    },
    favoriteMusic: {
      type: String,
      default: '',
    },
    about: {
      type: String,
      default: '',
    },
  },
});

module.exports = model('User', schema);
