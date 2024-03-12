const Expense = require('../models/Expense') ;
const User = require('../models/User');
const mongoose = require('mongoose');

exports.postExpense = async (req, res) => {

    const session = await mongoose.startSession();

    try {
        const expenseData = req.body;
        const user = req.user;

        expenseData.userId = user._id;
        const expense = new Expense(expenseData);
     
        session.startTransaction();
        const exp = await expense.save({session});
       
        let totalAmount;
        if (user.totalAmount) {
            totalAmount = user.totalAmount + +exp.amount;
        }
        else {
            totalAmount = exp.amount;
        }

        const updation = await User.updateOne({ _id: user._id },{$set:{ totalAmount: totalAmount} }, {session} )
        
        if (updation.modifiedCount > 0) {
            await session.commitTransaction();
            session.endSession()
            const expense = {
                id: exp._id,
                amount: exp.amount,
                description: exp.description,
                category: exp.category
            }
            res.status(201).json(expense);
        }
        else{
            throw new Error('amount not updated');
        }
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message })
    }
}




exports.getExpenses = (req, res) => {
    const user = req.user;
    const page = req.query.page;
    
    const itemsPerPage = 5
    const limit = Number(req.query.limit) || itemsPerPage;
    const offset = (page-1)* limit;
    const selectFields = '_id amount description category';
    Promise.all([
        Expense.countDocuments({userId: user._id}), 
        Expense.find({userId: user._id})
        .select(selectFields)
        .skip(offset)
        .limit(limit)
        ])
        .then(([count, expenses]) => {
            const hasMoreData = count - (page-1)*limit > limit ? true : false;
            const nextPage = hasMoreData ? Number(page) + 1 : undefined;
            const previousPage = page > 1 ? Number(page)-1 : undefined;
            const hasPreviousPage = previousPage ? true : false;
            res.status(200).json(
                {
                    expenses: expenses,
                    hasNextPage: hasMoreData,
                    nextPage: nextPage,
                    currentPage: page,
                    previousPage: previousPage,
                    hasPreviousPage: hasPreviousPage
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'Internal server error' })
        });
}




exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    const user = req.user;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const userAmount = await Expense
        .findOne({_id: expenseId, userId: user._id})
        .select('amount');

        if (!userAmount.amount || userAmount.amount === 0) {
            return res.status(404).json({ message: "Expense not found or unauthorized to delete" });
        }

        const amountToDelete = userAmount.amount;
        const del = await Expense.deleteOne({ _id: expenseId, userId: user._id }, {session});
     
        if (del.deletedCount != 0) {
            const updation = await User.updateOne(
                { _id: user._id },
                {$set: {totalAmount: user.totalAmount - amountToDelete}},
                {session}
            );

            if (updation.modifiedCount > 0) {
                await session.commitTransaction();
                session.endSession()
                return res.status(204).json({ message: "Resource deleted successfully" });
            }
            else {
                throw new Error('Something wrong in updation');
            }
        }
        else {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: "Expense not found or unauthorized to delete" });
        }
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
};












