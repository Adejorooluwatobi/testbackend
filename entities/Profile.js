const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // A user should only have one profile
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  dob: {
    type: Date,
  },
  bio: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', ProfileSchema);
