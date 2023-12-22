const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const Expense = require('./models/expense');
const User = require('./models/User')

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync()
.then(result=> app.listen(3000))
.catch(err=> console.log(err))
