const User = require('../models/User');
const Sib = require('sib-api-v3-sdk');

const tranEmailApi = new Sib.TransactionalEmailsApi();

// Set the Sendinblue API key during the application initialization
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (user) {
    const sender = {
      email: 'rundan.onkar@gmail.com',
      name: 'Rundan Onkar'
    };

    const receivers = [
      {
        email: email,
      },
    ];

    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Reset the password',
        textContent: 'Visit the link to reset password',
      })
      .then((response) => {
        console.log(response);
        res.status(200).json({ message: 'Password reset email sent successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};
