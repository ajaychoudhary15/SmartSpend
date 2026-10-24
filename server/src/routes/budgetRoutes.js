const express = require('express');
const router = express.Router();
const { getBudget, setBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getBudget);
router.post('/', setBudget);

module.exports = router;
