const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const sequelize = require('./util/database');

//middleware
const userAuthentication = require('./middlewares/auth');

//routes
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password');

//models
const Expense = require('./models/Expense');
const User = require('./models/User');
const Order = require('./models/Order');
const ForgotPassword = require('./models/ForgotPassword');
const DownloadedFile = require('./models/DownloadedFile');


const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'});

require('dotenv').config();

app.use(cors());
app.use(compression())
app.use(morgan('combined', {stream: accessLogStream}),);
app.use(bodyParser.json());



//router middlewares
app.use('/user', userRoutes);
app.use('/password', passwordRoutes);

app.use(userAuthentication.authenticate);

app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);



//DB Relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);


const PORT = process.env.PORT_NO || 3000;

//initiates server
function initiate() {
    sequelize.sync()
        .then(result => {
            app.listen(PORT, ()=>{
                console.log(`>>>>>>>>server running on port ${PORT}`)
            });
        })
        .catch(err => console.log(err));
}

initiate();