const User = require('../models/User');

function isStringValidate(string) {
    if(string.length===0 || !string){
        return false;
    }
    return true;
}

exports.signUp = (req, res)=> {
    const {username, email, password} = req.body;

    if(!isStringValidate(username) || !isStringValidate(email) || !isStringValidate(password)){
        return res.status(400).json({error: 'Bad parameters: Something is missing'})
    }

    User.findOne({where: {email: email}})
    .then((user)=> {

        if(user) {
            //if user already exist, send 409 conflict response
            return res.status(409).json({error: 'User already exist'})
        }

        User.create({username, email, password})
        .then(()=>{
            res.status(201).json({message:'User Created Successfully'});
        })
    })
    .catch((err)=> {
        res.status(500).json({ error: 'Internal Server Error' });
    })
}



exports.login = (req, res)=> {
    const {email, password} = req.body;
    console.log(email,password)
    if( !isStringValidate(email) || !isStringValidate(password)){
        return res.status(400).json({error: 'Bad parameters: Something is missing'})
    }

    User.findOne({where: {email: email}})
    .then((user)=> {
        if(!user) {
            return res.status(404).json({error: 'Wrong Email or password'})
        }

        User.findOne({where: {password: password}})
        .then((user)=> {
            if(!user) {
                return res.status(404).json({error: 'Wrong Email or password'});
            }

            res.status(201).json('Successfully login');
        })
    })
    .catch((err)=> {
        res.status(500).json({ error: 'Internal Server Error' });
    })
}