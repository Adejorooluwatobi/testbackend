const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  banner: {
    header: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  choose: {
    suggestedAmounts: { type: [Number], default: [1000, 5000, 10000, 20000, 50000] },
    programs: { type: [String], default: [] }
  },
  addition: [{
    header: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  card: [{
    header: { type: String, default: '' },
    annualGoal: { type: Number, default: 0 },
    amountRaised: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    items: [{
      figure: { type: String, default: '' },
      label: { type: String, default: '' }
    }]
  }],
  details: [{
    header: { type: String, default: '' },
    accountname: { type: String, default: '' },
    bank: { type: String, default: '' },
    accountno: { type: String, default: '' },
    text: { type: String, default: '' }
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Donation', DonationSchema);
