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
        const leaderboardData = await User.findAll(
            {
                attributes:['username', 'totalAmount'],
                order:[['totalAmount', 'DESC']]
            }
        )
        res.status(200).json(leaderboardData);
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
