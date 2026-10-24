const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionStats,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// All transaction routes are protected
router.use(protect);

router.get('/', getTransactions);
router.post('/', addTransaction);
router.get('/stats', getTransactionStats);
router.get('/categories', getCategories);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
