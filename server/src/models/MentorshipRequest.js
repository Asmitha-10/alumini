const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    responseMessage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

mentorshipRequestSchema.index({ student: 1, alumni: 1, createdAt: -1 });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
