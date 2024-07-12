const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortid.generate
  }
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
