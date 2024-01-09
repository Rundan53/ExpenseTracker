const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/User');

exports.purchasePremium = async (req, res) => {
    try {
        const user = req.user;
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 2500;
        const currency = 'INR';

        rzp.orders.create({ amount, currency}, (err, order) => {
            if (err) {
                throw new Error(err)
            }

            user.createOrder({orderId: order.id, status: 'PENDING'})
            .then((response)=> {
                return res.status(201).json({order, key_id: rzp.key_id});
            })
            .catch((err)=> {
                throw new Error(err)
            })
        })
    }
    catch (err) {
       res.status(403).json({message: 'Something went Wrong', error: err}) 
    }
};


exports. updateStatus = (req, res)=> {

    if(req.body.status === 'FAILED'){

        const {order_id} = req.body;

        Order.update({status: 'FAILED'}, {where: {orderId: order_id}})
        .then((updation)=> {
            if(updation[0] > 0) {
                return res.status(200).json({message: 'Payment failed'});
            }

            res.status(404).json({message: 'Something went wrong'});
        })
        .catch((err)=> {
            res.status(500).json({message: 'Internal Server Error'})
        })

       return;
    }


    const {order_id, payment_id} = req.body;

    Promise.all([Order.update({paymentId: payment_id, status: 'SUCCESSFUL'}, {where: {orderId: order_id}}),
                 User.update({isPremiumUser: true}, {where: {id: req.user.id}})])
    .then(([orderUpdate, userUpdate])=> {
        if(orderUpdate[0] > 0 && userUpdate[0] > 0){
            return res.status(200).json({message: `Enjoy! You're A Premium User`})
        }

        res.status(404).json({message: 'Something went wrong'});
    })
    .catch((err)=>{
        res.status(500).json({message: 'Internal Server Error'})
    })
};

