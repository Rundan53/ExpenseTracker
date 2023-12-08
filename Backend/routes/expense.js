const expenseController = require('../controllers/expense')

const express = require('express');

const router = express.Router();

router.post('/expenses', expenseController.postExpense);

router.get('/getExpenses', expenseController.getExpenses);

router.delete('/deleteExpense/:id', expenseController.deleteExpense)

module.exports = router;