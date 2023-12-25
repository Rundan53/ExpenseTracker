const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors')

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase')

const Expense = require('./models/Expense');
const User = require('./models/User');
const Order = require('./models/Order');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(result=> app.listen(3000))
.catch(err=> console.log(err))
