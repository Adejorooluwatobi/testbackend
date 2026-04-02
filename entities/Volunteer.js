const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  banner: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  header: { type: String, default: '' },
  title: { type: String, default: '' },
  card: { type: Array, default: [] }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
