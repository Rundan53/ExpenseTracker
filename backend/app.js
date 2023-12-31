const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors')

const sequelize = require('./util/database');

//middleware
const userAuthentication = require('./middlewares/auth')

//routes
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase')
const premiumRoutes = require('./routes/premium')
const passwordRoutes = require('./routes/password') 

//models
const Expense = require('./models/Expense');
const User = require('./models/User');
const Order = require('./models/Order');
const ForgotPassword = require('./models/ForgotPassword');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes);
app.use('/password', passwordRoutes);

app.use(userAuthentication.authenticate);

app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

sequelize.sync()
.then(result=> app.listen(3000))
.catch(err=> console.log(err));
