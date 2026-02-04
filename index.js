const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Environment variables ke liye

const app = express();
app.use(express.json());

// Test Route: Check if server is running
app.get('/', (req, res) => {
    res.send('Server is live! Mailer app changed port to 587 and removed tls config.');
});

// Email Sending Route
app.post('/api/send-email', async (req, res) => {
    const { to, subject, message } = req.body;
    console.log("Request Body:", req.body);

    // 1. Transporter Setup
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2. Mail Options
    let mailOptions = {
        from: `"Mailer App" <${process.env.EMAIL_USER}>`
        to: to, // Agar body me email na ho toh default
        subject: subject || "Render Testing - Nodemailer",
        text: message || "Hello! This is a test email from your Render-deployed MERN app."
    };

    // 3. Send Mail
    try {
        let info = await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));