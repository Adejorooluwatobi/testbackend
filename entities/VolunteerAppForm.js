const mongoose = require('mongoose');

const VolunteerAppFormSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  phonenumber: { type: String },
  stateOfResidence: { type: String },
  availability: { type: String },
  areaOfExpertise: { type: String },
  preferredProgram: { type: String },
  whatYouVolunteer: { type: String },
  isRead: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional reference to User
}, {
  timestamps: true,
});

module.exports = mongoose.model('VolunteerAppForm', VolunteerAppFormSchema);
