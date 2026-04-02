const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  banner: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  card: { type: Array, default: [] }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Program', ProgramSchema);
