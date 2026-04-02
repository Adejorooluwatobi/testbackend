const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  email: { type: String, default: '' },
  phonenumber: { type: String, default: '' },
  subject: { type: String, default: '' },
  message: { type: String, default: '' },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
