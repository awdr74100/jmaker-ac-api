const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    default: null,
  },
  userNumber: {
    type: String,
    default: null,
  },
  auth: {
    type: Boolean,
    default: false,
  },
  approvalAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
