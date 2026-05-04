const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  bugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bug',
    required: true
  },
  bugTitle: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['created', 'status changed', 'deleted']
  },
  changedBy: {
    type: String,
    required: true
  },
  oldValue: {
    type: String
  },
  newValue: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);