const mongoose = require('mongoose');

const DonationTransactionSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  amount: { type: Number },
  program: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'success' // Defaulting to success as per user requirement to ignore gateway for now
  },
  isRead: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional reference to User
}, {
  timestamps: true,
});

module.exports = mongoose.model('DonationTransaction', DonationTransactionSchema);
