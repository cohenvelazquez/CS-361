const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  size:     { type: Number, required: true },
  type:     { type: String, required: true },
  path:     { type: String, required: true },
  uploaded: { type: Date,   default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
