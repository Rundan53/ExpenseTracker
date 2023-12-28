const Expense = require('../models/Expense')

exports.postExpense = (req, res) => {
    const expenseData = req.body;
    const user = req.user;

    user.createExpense(expenseData)
        .then((exp) => {
            const expense = {
                id: exp.id,
                amount: exp.amount,
                description: exp.description,
                category: exp.category
            }
        
            res.status(201).json(expense);
        })
        .catch(err =>{
            res.status(500).json({message: 'Internal server error'})
        });
}


exports.getExpenses = (req, res) => {
    const user = req.user;

    user.getExpenses({attributes: ['id', 'amount', 'description', 'category']})
        .then((expenses) => {
            res.status(200).json(expenses)
        })
        .catch(err => {
            res.status(500).json({message: 'Internal server error'})
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
                    {message: "Expense not found or unauthorized to delete"}
                );
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Internal server error'
            });
        });
}






