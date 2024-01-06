const { Sequelize } = require('sequelize');

const Expense = require('../models/Expense');
const User = require('../models/User');
const DownloadedFile = require('../models/DownloadedFile');

const S3service = require('../services/s3service');



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




exports.downloadExpense = async (req, res) => {
    try{
        const userId = req.user.id;

        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `expense${userId}/${new Date()}.txt`;
    
        const fileUrl = await S3service.uploadToS3(stringifiedExpenses, fileName);

        const response = await req.user.createDownloadedFile({fileUrl});

        if(response){
            return res.status(200).json({fileUrl, success: true});
        }

       throw new Error('Failed to create a record in the DownloadedFiles');
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl:'', error: err, success:false})
    }
   
};


exports.getFileUrl = async (req, res)=> {
    try{
        const files = await req.user.getDownloadedFiles({attributes: ['fileUrl']});
        if(files){
            return res.status(200).json({fileUrl: files, success: true});
        }

        throw new Error('error in fetching history');
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '', success:false, error:err})
    }
}