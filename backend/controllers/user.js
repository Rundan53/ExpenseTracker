const User = require('../models/User');

exports.postUser = (req, res)=> {
    const userToAdd = req.body;

    User.findOne({where: 
        {email: userToAdd.email}
    })
    .then((user)=> {

        if(user) {
            //if user already exist, send 409 conflict response
            return res.status(409).json({error: 'user already exist'})
        }

        User.create(userToAdd)
        .then(()=>{
            res.status(201).json({message:'User Created Successfully'})
        })
    })
    .catch((err)=> {
        res.status(500).json({ error: 'Internal Server Error' });
    })
}