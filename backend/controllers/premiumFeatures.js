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
        res.status(500).json('Internal server error')
    })
}


exports.getLeaderboard = async (req, res)=> {

    try{
        const expenses = await Expense.findAll({attributes: ['userId', 'amount']});
        const users = await User.findAll({attributes: ['id', 'username']});
    
        const totalExp = [];
        expenses.forEach(exp => {
            if(totalExp[exp.userId]){
                totalExp[exp.userId] = totalExp[exp.userId] + exp.amount;
            }
            else{
                totalExp[exp.userId] = exp.amount;
            }
            
        });
    
        const leaderboardData = [];
        let i = 0;
        users.forEach((user)=> {
            leaderboardData[i]= {username: user.username, totalAmount: totalExp[user.id]};
            i++;
        });

        res.status(200).json(leaderboardData);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}