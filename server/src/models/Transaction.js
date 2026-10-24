const mongoose = require('mongoose');

const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Housing & Rent',
  'Utilities & Bills',
  'Transportation',
  'Healthcare & Fitness',
  'Entertainment & Leisure',
  'Shopping & Groceries',
  'Education',
  'Salary',
  'Freelance & Side Hustle',
  'Investments & Dividends',
  'Gifts & Grants',
  'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a transaction title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type (must be income or expense)',
      },
      required: [true, 'Please specify transaction type (income or expense)'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      default: 'Other',
    },
    date: {
      type: Date,
      required: [true, 'Please specify a transaction date'],
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user-based date range queries
transactionSchema.index({ user: 1, date: -1 });

module.exports = {
  Transaction: mongoose.model('Transaction', transactionSchema),
  TRANSACTION_CATEGORIES,
};
