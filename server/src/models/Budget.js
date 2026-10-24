const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: String, // Format: YYYY-MM
      required: true,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format'],
    },
    monthlyLimit: {
      type: Number,
      required: [true, 'Please provide a monthly budget limit'],
      min: [0, 'Budget limit cannot be negative'],
    },
    alertThreshold: {
      type: Number,
      default: 80, // Warn when expenses reach 80% of budget
      min: [1, 'Alert threshold must be at least 1%'],
      max: [100, 'Alert threshold cannot exceed 100%'],
    },
  },
  {
    timestamps: true,
  }
);

// One budget per user per month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
