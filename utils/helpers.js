const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    await transporter.sendMail({
        from: '"Your App Name" <no-reply@yourapp.com>',
        to,
        subject,
        text,
    });
};

module.exports = { generateOTP, sendEmail };
