const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  header: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  contactInformation: {
    ourOffice: { type: Array, default: [] },
    phoneNumbers: { type: Array, default: [] },
    emailAddress: { type: Array, default: [] }
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Contact', ContactSchema);
