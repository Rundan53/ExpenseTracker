const { Sequelize } = require('sequelize');
const Expense = require('../models/Expense');
const User = require('../models/User');



exports.premiumStatus = (req, res)=> {
    const user = req.user;
   
    User.findOne({where: {id: user.id, isPremiumUser: true}})
    .then((user)=>{
        if(user) {
            return res.status(200).json({isPremium: true});
        }
        res.status(200).json({isPremium: false});
    })
    .catch((err)=> {
        res.status(500).json('Internal server error');
    })
};


exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboardData = await User.findAll({
            attributes: ['username', [Sequelize.fn('sum', Sequelize.col('expenses.amount')), 'totalAmount']],
            include:[
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['users.id'],
            order: [[Sequelize.col('totalAmount'), 'DESC']]
        });

        console.log(leaderboardData);

        res.status(200).json(leaderboardData);
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
