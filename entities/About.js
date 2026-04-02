const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  banner: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  ourMission: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    cards: { type: Array, default: [] }
  },
  ourVision: {
    icon: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    progress: { type: Number, default: 0 }
  },
  team: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    card: { type: Array, default: [] }
  },
  ourJourney: { type: Array, default: [] }
}, {
  timestamps: true,
});

module.exports = mongoose.model('About', AboutSchema);
