const Expense = require('../models/expense')

exports.postExpense = (req, res)=> {
    const expense = req.body;
    console.log(expense);
    Expense.create(expense)
    .then((exp)=> {
        res.json(exp);
    })
    .catch(err=> console.log(err));
}


exports.getExpenses = (req,res)=> {
    Expense.findAll()
    .then((expenses)=> {
        res.json(expenses)
    })
    .catch(err=> console.log(err));
}

exports.deleteExpense = (req, res)=> {
    Expense.destroy({where:{id:req.params.id}})
    .then((delExp)=> res.json(delExp))
    .catch((err)=> console.log(err.message));
}

