const expenseController = require('../controllers/expense')

const express = require('express');
const router = express.Router();

router.post('/add-expense', expenseController.postExpense);

router.get('/get-expenses', expenseController.getExpenses);

router.delete('/delete-expense/:id', expenseController.deleteExpense);






module.exports = router;