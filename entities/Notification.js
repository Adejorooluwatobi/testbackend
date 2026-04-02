const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['user_registration', 'donation', 'consultation', 'volunteer_app']
  },
  message: { type: String, required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', NotificationSchema);
