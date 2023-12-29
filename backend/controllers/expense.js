const Expense = require('../models/Expense')
const User = require('../models/User')
 
exports.postExpense = async (req, res) => {
    try{
        const expenseData = req.body;
        const user = req.user;
        
        const exp = await req.user.createExpense(expenseData);
    
        let totalAmount;
        if(user.totalAmount){
            totalAmount = user.totalAmount + +exp.amount;
        }
        else{
            totalAmount = exp.amount;
        }
        
        const updation = await User.update({totalAmount: totalAmount}, {where: {id: user.id}})
    
        if(updation[0] > 0){
            const expense = {
                id: exp.id,
                amount: exp.amount,
                description: exp.description,
                category: exp.category
            }
            res.status(201).json(expense);
        }
    }
    catch(err){
        res.status(500).json({message: 'Internal server error'})
    }   
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




exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    const user = req.user;

    try {
        const userAmount = await user.getExpenses({
            attributes: ['amount'],
            where: { id: expenseId }
        });

        if (!userAmount || userAmount.length === 0) {
            return res.status(404).json({ message: "Expense not found or unauthorized to delete" });
        }

        const amountToDelete = userAmount[0].amount;

        const delrows = await Expense.destroy({ where: { id: expenseId, userId: user.id } });

        if (delrows > 0) {
            const updatedUser = await User.update(
                { totalAmount: user.totalAmount - amountToDelete },
                { where: { id: user.id } }
            );

            if (updatedUser[0] > 0) {
                return res.status(204).json({ message: "Resource deleted successfully" });
            } 
            else {
                throw new Error('amount not updated');
            }
        }
        else {
            return res.status(404).json({ message: "Expense not found or unauthorized to delete" });
        }
    }
    catch (err) {
        res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
};







