const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  header: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  cards: { type: Array, default: [] }
}, {
  timestamps: true,
});

module.exports = mongoose.model('News', NewsSchema);
