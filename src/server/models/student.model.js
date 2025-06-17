// server/models/student.model.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false }, // Phone is optional
  codeforcesHandle: { type: String, required: true, unique: true },
  currentRating: { type: Number, required: true, },
  maxRating: { type: Number, required: true, },
  
  emailNotifications: { type: Boolean, default: true }
}, {
  // Adds createdAt and updatedAt timestamps
  timestamps: true,
  collection: 'students'
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
