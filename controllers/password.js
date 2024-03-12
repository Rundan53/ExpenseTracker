const User = require('../models/User');
const ForgotPassword = require('../models/ForgotPassword');

const { v4: uuidv4, v5: uuidv5 } = require('uuid')
const bcrypt = require('bcrypt');

require('dotenv').config();
const Sib = require('sib-api-v3-sdk')

const tranEmailApi = new Sib.TransactionalEmailsApi();

// Set the Sendinblue API key during the application initialization
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;



exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (user) {
            const randomUUID = uuidv4();
        
            const userPassword = new ForgotPassword({
                 _id: randomUUID,
                 active: true,
                 userId: user._id
            })

            await userPassword.save()
                .catch((err) => {
                    throw new Error(err);
                })

            const sender = {
                email: 'rundan.onkar@gmail.com',
                name: 'Rundan Onkar'
            };

            const receivers = [
                {
                    email: email,
                },
            ];

            const resetLink = `${process.env.WEBSITE}/password/reset-password/${randomUUID}`

            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset the password',
                htmlContent: `<p>Visit the following link to reset your password:</p>
                              <a href="${resetLink}">click here to reset password</a>`
            })
                .then((response) => {
                    console.log(response);
                    res.status(200).json({ message: 'Password reset email sent successfully' });
                })
                .catch((error) => {
                    console.log(error.message)
                    throw new Error('Internal server error')
                });
        }
        else {
            res.status(404).json({ message: 'User not found with this email' });
        }
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json(err.message);
    }

};



exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordReqId = req.params.id;

        const forgotPasswordReq = await ForgotPassword.findOne({ _id: resetPasswordReqId } );

        if (forgotPasswordReq && forgotPasswordReq.active) {
            await ForgotPassword.updateOne({ _id: resetPasswordReqId },{$set: { active: false }});

            const htmlContent = `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="/css/resetPassword.css">
                <title>Password Reset</title>
              </head>
              <body>
                <form action="${process.env.WEBSITE}/password/update-password/${resetPasswordReqId}" method="GET">
                  <h2>Password Reset</h2>
                  <label for="newpassword">Enter New Password</label>
                  <input name="newpassword" type="password" required>
                  <button type="submit">Reset Password</button>
                </form>
              </body>
            </html>`

            res.status(200).send(htmlContent);
            res.end();
        }
        else {
            throw new Error('Password reset link expired or not found')
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' })
    }

}



exports.updatePassword = async (req, res) => {
    const { newpassword } = req.query;
    const { id } = req.params;
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(newpassword, saltRounds)

        const result = await ForgotPassword.findOne({_id: id } )
        console.log('resultttttttt', result)
        if (!result || !result.userId) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updation = await User.updateOne({_id: result.userId}, {$set: {password: hash }})
        
        if(updation.modifiedCount>0){
            res.status(200).json({ message: 'Password updated successfully' });
        }
        else{
            throw new error('unable to update password')
        }
        
    }
    catch (err) {
        res.status(500).json(err.message || 'Internal server error')
    }

}


