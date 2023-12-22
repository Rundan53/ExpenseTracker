const Expense = require('../models/expense')

exports.postExpense = (req, res) => {
    const expenseData = req.body;
    const user = req.user;

    user.createExpense(expenseData)
        .then((exp) => {
            res.status(201).json(exp);
        })
        .catch(err =>{
            res.status(500).json({error: 'Internal server error'})
        });
}


exports.getExpenses = (req, res) => {
    const userId = req.user.id
    const user = req.user;

    user.getExpenses()
        .then((expenses) => {
            res.status(200).json(expenses)
        })
        .catch(err => {
            res.status(500).json({error: 'Internal server error'})
        });
}

exports.deleteExpense = (req, res) => {
    const expenseId = req.params.id;
    const user = req.user;
    Expense.destroy({ where: { id: expenseId, userId: user.id } })
        .then((delrows) => {
            if (delrows > 0) {
                return res.status(204).json(
                    {message: "Resource deleted successfully"}
                );
            }
            else{
                return res.status(404).json(
                    {error: "Expense not found or unauthorized to delete"}
                );
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: 'Internal server error'
            });
        });
}

