const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the client name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide the client email address'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please provide the client contact phone number'],
      trim: true
    },
    courseInterest: {
      type: String,
      required: [true, 'Please specify the course of interest'],
      trim: true,
      maxlength: [150, 'Course interest cannot exceed 150 characters']
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['unclaimed', 'claimed'],
        message: 'Status must be either unclaimed or claimed'
      },
      default: 'unclaimed',
      index: true
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    claimedAt: {
      type: Date,
      default: null
    },
    source: {
      type: String,
      enum: ['public_form', 'counselor_referral', 'online_campaign'],
      default: 'public_form'
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying public unclaimed leads efficiently
leadSchema.index({ status: 1, createdAt: -1 });
// Compound index for querying a counselor's claimed leads efficiently
leadSchema.index({ claimedBy: 1, status: 1, createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;

