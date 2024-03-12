//Import necessary packages and modules
const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const mongoose = require('mongoose');


//middleware for user authentication
const userAuthentication = require('./middlewares/auth');

//routes
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');


//write stream for access log
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'});


//load environment variables from .env file
require('dotenv').config();


//some useful middlewares
app.use(cors());
app.use(express.static('public'));
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());



app.get('/',(req, res)=>{
    res.sendFile('signup.html', {root: 'views'});
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', {root:'views'});
});

app.get('/reset-password', (req, res) => {
    res.sendFile('forgotpassword.html', {root:'views'});
});

app.get('/home', (req, res) => {
    res.sendFile('expense.html', {root:'views'});
});



//router middlewares
app.use('/user', userRoutes);
app.use('/password', passwordRoutes);

app.use(userAuthentication.authenticate);

app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);



const PORT = process.env.PORT_NO;
const username = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
//initiates server
function initiate() {
    mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.taxt5br.mongodb.net/expense-tracker?retryWrites=true`)
        .then(result => {
            console.log('connected to db')
            app.listen(PORT, ()=>{
                console.log(`>>>>>>>>server running on port ${PORT}`)
            });
        })
        .catch(err => console.log(err));
}

initiate();