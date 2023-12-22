const expenseController = require('../controllers/expense')
const userAuthentication = require('../middlewares/auth')

const express = require('express');
const router = express.Router();

router.post('/add-expense', userAuthentication.authenticate, expenseController.postExpense);

router.get('/get-expenses', userAuthentication.authenticate, expenseController.getExpenses);

router.delete('/delete-expense/:id', userAuthentication.authenticate, expenseController.deleteExpense)

module.exports = router;