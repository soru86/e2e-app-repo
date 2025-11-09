const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  username: {
    type: String,
  },
  provider: {
    type: String,
    enum: ['google', 'facebook', 'github', 'linkedin'],
    required: true,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  facebookId: {
    type: String,
    sparse: true,
  },
  githubId: {
    type: String,
    sparse: true,
  },
  linkedinId: {
    type: String,
    sparse: true,
  },
  refreshToken: {
    type: String,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ facebookId: 1 });
userSchema.index({ githubId: 1 });
userSchema.index({ linkedinId: 1 });

module.exports = mongoose.model('User', userSchema);

