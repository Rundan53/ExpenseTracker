const User = require('../models/User');
const ForgotPassword = require('../models/ForgotPassword');

const { v4: uuidv4, v5: uuidv5 } = require('uuid')
const bcrypt = require('bcrypt');


const Sib = require('sib-api-v3-sdk');

const tranEmailApi = new Sib.TransactionalEmailsApi();

// Set the Sendinblue API key during the application initialization
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;



exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email: email } });

        if (user) {
            const randomUUID = uuidv4();

            await user.createForgotPassword({ id: randomUUID, active: true })
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

            const resetLink = `http://localhost:3000/password/reset-password/${randomUUID}`

            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Reset the password',
                // textContent: 'Visit the link to reset password',
                htmlContent: `<p>Visit the following link to reset your password:</p>
                              <a href="${resetLink}">click here to reset password</a>`
            })
                .then((response) => {
                    console.log(response);
                    res.status(200).json({ message: 'Password reset email sent successfully' });
                })
                .catch((error) => {
                    throw new Error('Internal server error')
                });
        }
        else {
            res.status(404).json({ message: 'User not found with this email' });
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }

};



exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordReqId = req.params.id;

        const forgotPasswordReq = await ForgotPassword.findOne({ where: { id: resetPasswordReqId } });

        if (forgotPasswordReq.active) {
            await ForgotPassword.update({ active: false }, { where: { id: resetPasswordReqId} });
            res.status(200).send(`<html>
                <script>
                    function formsubmitted(e){
                        e.preventDefault();
                    }
                </script>

                <form action="/password/update-password/${resetPasswordReqId}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>
            </html>`)

            res.end();
        }
        else {
            throw new Error('link expired')
        }
    }
    catch (err) {
        res.status(500).json(err.message || 'Internal server error')
    }

}



exports.updatePassword = async (req, res) => {
    const { newpassword } = req.query;
    const { id } = req.params;
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(newpassword, saltRounds)

        const result = await ForgotPassword.findOne({ where: { id } })

        if (!result || !result.userId) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.update({ password: hash }, { where: { id: result.userId } })

        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (err) {
        res.status(500).json(err.message || 'Internal server error')
    }

}


