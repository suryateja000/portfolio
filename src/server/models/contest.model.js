
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contestSchema = new Schema({
  codeHandle: {
    type: String,
    required: true,
    index: true 
  },
  contestId: {
    type: Number,
    required: true
  },
  contestName: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true
  },
  oldRating: {
    type: Number,
    required: true
  },
  newRating: {
    type: Number,
    required: true
  },
  ratingUpdateTimeSeconds: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  unique: ['codeHandle', 'contestId'] 
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
