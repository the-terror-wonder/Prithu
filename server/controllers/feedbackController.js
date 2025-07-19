const nodemailer = require('nodemailer');

exports.sendFeedback = async (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please fill out all fields.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`, // Shows the sender's name and email
        to: process.env.EMAIL_USER,    // Sends to your email address
        replyTo: email,                // Sets the reply-to field
        subject: `New Suggestion for Prithu from ${name}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ msg: 'Thank you! Your suggestion has been sent.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Sorry, there was an error sending your message.' });
    }
};