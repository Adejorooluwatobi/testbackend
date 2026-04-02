const mongoose = require('mongoose');

const HomePageSchema = new mongoose.Schema({
  banner: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    buttons: { type: Array, default: [] },
    imageUrl: { type: String, default: '' },
    bannerSummary: { type: Array, default: [] }
  },
  whatWeDo: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    items: { type: Array, default: [] }
  },
  testimonials: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    items: { type: Array, default: [] }
  },
  quote: {
    header: { type: String, default: '' },
    text: { type: String, default: '' },
    author: { type: String, default: '' },
    cards: { type: Array, default: [] }
  },
  donate: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    buttons: { type: Array, default: [] }
  },
  partners: { type: Array, default: [] }
}, {
  timestamps: true,
});

module.exports = mongoose.model('HomePage', HomePageSchema);
