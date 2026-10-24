const { Transaction, TRANSACTION_CATEGORIES } = require('../models/Transaction');

// @desc    Get user transactions with filtering, searching, and sorting
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      category,
      type,
      startDate,
      endDate,
      month,
      sort = 'date_desc',
      page = 1,
      limit = 50,
    } = req.query;

    const query = { user: req.user._id };

    // Search by title or notes
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { notes: searchRegex }];
    }

    // Filter by type (income or expense)
    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }

    // Filter by category
    if (category && category !== 'All' && category !== '') {
      query.category = category;
    }

    // Filter by specific Month (YYYY-MM)
    if (month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      const [yearStr, monthStr] = month.split('-');
      const year = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10) - 1; // 0-indexed
      const startOfMonth = new Date(Date.UTC(year, m, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, m + 1, 0, 23, 59, 59, 999));
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // End of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sort order
    let sortOption = { date: -1, createdAt: -1 };
    if (sort === 'date_asc') sortOption = { date: 1, createdAt: 1 };
    if (sort === 'amount_desc') sortOption = { amount: -1 };
    if (sort === 'amount_asc') sortOption = { amount: 1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100;
    const skip = (pageNum - 1) * limitNum;

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        total: totalCount,
        page: pageNum,
        pages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics, category distribution & monthly chart trends
// @route   GET /api/transactions/stats
// @access  Private
const getTransactionStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { month } = req.query;

    // Filter date condition for current stats view
    let dateFilter = {};
    if (month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      const [yearStr, monthStr] = month.split('-');
      const year = parseInt(yearStr, 10);
      const m = parseInt(monthStr, 10) - 1;
      const startOfMonth = new Date(Date.UTC(year, m, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, m + 1, 0, 23, 59, 59, 999));
      dateFilter = { date: { $gte: startOfMonth, $lte: endOfMonth } };
    }

    // 1. Overall or filtered Totals (Income, Expense, Balance)
    const totalsMatch = { user: userId, ...dateFilter };
    const totalsAgg = await Transaction.aggregate([
      { $match: totalsMatch },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let transactionCount = 0;

    totalsAgg.forEach((item) => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpense = item.total;
      transactionCount += item.count;
    });

    const netBalance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;

    // 2. Expense Category breakdown
    const categoryAgg = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense', ...dateFilter } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const categoryBreakdown = categoryAgg.map((cat) => ({
      category: cat._id,
      total: Math.round(cat.total * 100) / 100,
      count: cat.count,
      percentage: totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0,
    }));

    // 3. Monthly Trends for the last 6 months (for Bar and Area charts)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyAgg = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Build unified 6 months series
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yr = d.getFullYear();
      const mo = d.getMonth() + 1; // 1-indexed for aggregation matching
      const label = `${monthNames[mo - 1]} ${yr.toString().slice(-2)}`;

      const inc = monthlyAgg.find(
        (m) => m._id.year === yr && m._id.month === mo && m._id.type === 'income'
      );
      const exp = monthlyAgg.find(
        (m) => m._id.year === yr && m._id.month === mo && m._id.type === 'expense'
      );

      const incomeVal = inc ? inc.total : 0;
      const expenseVal = exp ? exp.total : 0;

      monthlyTrends.push({
        month: label,
        yearMonth: `${yr}-${String(mo).padStart(2, '0')}`,
        income: Math.round(incomeVal * 100) / 100,
        expense: Math.round(expenseVal * 100) / 100,
        savings: Math.round((incomeVal - expenseVal) * 100) / 100,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome: Math.round(totalIncome * 100) / 100,
          totalExpense: Math.round(totalExpense * 100) / 100,
          netBalance: Math.round(netBalance * 100) / 100,
          savingsRate: Math.round(savingsRate * 10) / 10,
          transactionCount,
        },
        categoryBreakdown,
        monthlyTrends,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, and type (income or expense)',
      });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title: title.trim(),
      amount: numAmount,
      type: type.toLowerCase(),
      category: category ? category.trim() : 'Other',
      date: date ? new Date(date) : new Date(),
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction recorded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify user owns this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this transaction',
      });
    }

    const { title, amount, type, category, date, notes } = req.body;

    if (title !== undefined) transaction.title = title.trim();
    if (amount !== undefined) {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number',
        });
      }
      transaction.amount = numAmount;
    }
    if (type !== undefined) transaction.type = type.toLowerCase();
    if (category !== undefined) transaction.category = category.trim();
    if (date !== undefined) transaction.date = new Date(date);
    if (notes !== undefined) transaction.notes = notes.trim();

    const updated = await transaction.save();

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify user owns this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction',
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      success: true,
      data: { id: req.params.id },
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get predefined category list
// @route   GET /api/transactions/categories
// @access  Private
const getCategories = (req, res) => {
  res.status(200).json({
    success: true,
    data: TRANSACTION_CATEGORIES,
  });
};

module.exports = {
  getTransactions,
  getTransactionStats,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
};
