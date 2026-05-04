const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['reporter', 'developer', 'admin'],
    default: 'reporter',
  },
}, {
  timestamps: true,
});

// Hash password before saving if it's not already hashed
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Check if password is already hashed (starts with $2b$)
  if (this.password.startsWith('$2b$')) return next();

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
