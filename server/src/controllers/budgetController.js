const Budget = require('../models/Budget');
const { Transaction } = require('../models/Transaction');

// Helper to get formatted current month 'YYYY-MM'
const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// @desc    Get budget details & spending warning status for a month
// @route   GET /api/budget
// @access  Private
const getBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const month = req.query.month || getCurrentMonthString();

    // Find the configured budget for this month
    const budget = await Budget.findOne({ user: userId, month });

    // Calculate total expenses for this month
    const [yearStr, monthStr] = month.split('-');
    const year = parseInt(yearStr, 10);
    const m = parseInt(monthStr, 10) - 1;
    const startOfMonth = new Date(Date.UTC(year, m, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, m + 1, 0, 23, 59, 59, 999));

    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const spent = expenseAgg.length > 0 ? Math.round(expenseAgg[0].total * 100) / 100 : 0;
    const monthlyLimit = budget ? budget.monthlyLimit : 0;
    const alertThreshold = budget ? budget.alertThreshold : 80;

    let percentageUsed = 0;
    let status = 'no_budget'; // 'no_budget' | 'safe' | 'warning' | 'exceeded'

    if (monthlyLimit > 0) {
      percentageUsed = Math.round((spent / monthlyLimit) * 100);
      if (percentageUsed > 100) {
        status = 'exceeded';
      } else if (percentageUsed >= alertThreshold) {
        status = 'warning';
      } else {
        status = 'safe';
      }
    }

    const remaining = monthlyLimit > 0 ? Math.round((monthlyLimit - spent) * 100) / 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        month,
        monthlyLimit,
        alertThreshold,
        spent,
        remaining,
        percentageUsed,
        status,
        hasBudgetSet: !!budget && monthlyLimit > 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update monthly budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month = getCurrentMonthString(), monthlyLimit, alertThreshold = 80 } = req.body;

    if (monthlyLimit === undefined || isNaN(parseFloat(monthlyLimit))) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid numeric monthly budget limit',
      });
    }

    const limit = parseFloat(monthlyLimit);
    if (limit < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget limit cannot be negative',
      });
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      { user: userId, month },
      {
        monthlyLimit: limit,
        alertThreshold: Math.min(100, Math.max(1, parseInt(alertThreshold, 10) || 80)),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      data: updatedBudget,
      message: `Monthly budget for ${month} saved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudget,
  setBudget,
};
