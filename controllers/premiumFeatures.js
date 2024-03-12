const Expense = require('../models/Expense');
const User = require('../models/User');
const DownloadedFile = require('../models/DownloadedFile');

const S3service = require('../services/s3service');



exports.premiumStatus = (req, res)=> {
    const user = req.user;
   
    User.findOne({_id: user._id, isPremiumUser: true})
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
        const leaderboardData = await User
        .find()
        .select('username totalAmount')
        .sort({totalAmount: -1})

        res.status(200).json(leaderboardData);
    } 
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};




exports.downloadExpense = async (req, res) => {
    try{
        const userId = req.user._id;

        const expenses = await Expense.find({userId: userId});
        const stringifiedExpenses = JSON.stringify(expenses);
        const fileName = `expenses/expense${userId}/${new Date()}.txt`;
    
        const fileUrl = await S3service.uploadToS3(stringifiedExpenses, fileName);

        const downlaodedFile = new DownloadedFile({
            fileUrl: fileUrl,
            userId: userId
        })
        const response = await downlaodedFile.save();

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
        console.log('inside controller')
        const files = await DownloadedFile
        .find({userId: req.user._id})
        .select('fileUrl updatedAt')
       
        console.log(files)
        if(files){
            return res.status(200).json({fileUrl: files, success: true});
        }

        throw new Error('No files found for the user.');
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileUrl: '', success:false, error:err});
    }
}