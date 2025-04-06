const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
    const msg = {
        to,
        from: 'krgayan97@gmail.com',
        subject,
        text,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error sending email body:', error.response.body.errors);
    }
};

module.exports = { generateOTP, sendEmail };
