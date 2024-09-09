const express = require('express');
const mailgun = require('mailgun-js');
const path = require('path');
const app = express();
const port = 3030;

// Mailgun configuration
const mg = mailgun({
    apiKey: 'deeb4c45f7802bd35f13f0a70e1640d3-826eddfb-01568fe0',
    domain: 'sandbox3bbace3986da442aad4843deadf24ee1.mailgun.org'
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Welcome email route
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    const data = {
        from: 'Dev@Deakin <no-reply@yourdomain.com>',
        to: email,
        subject: 'Welcome to Dev@Deakin',
        text: 'Thank you for subscribing to Dev@Deakin. We are excited to have you on board!'
    };

    mg.messages().send(data, (error, body) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error sending email');
        }
        res.status(200).send('Welcome email sent');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
