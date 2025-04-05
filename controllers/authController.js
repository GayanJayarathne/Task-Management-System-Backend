const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendEmail } = require('../utils/helpers');
require('dotenv').config();

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;
const refreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;

//Email Verification and OTP Generation
const requestOTP = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60000);

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    await sendEmail(user.email, 'Your OTP Code', `Your OTP code is ${otp}. It will expire in 10 minutes.`);

    res.status(200).json({ message: 'OTP sent to your email.' });
};

//OTP Validation and Password Prompt
const validateOTP = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpiration) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.otp = undefined;
    user.otpExpiration = undefined;
    await user.save();

    res.status(200).json({
        message: 'OTP verified.',
        isFirstLogin: user.isFirstLogin,
    });
};

//Password Validation/Creation and User Authentication
const submitPassword = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    let successMessage = 'Authentication successful.';

    if (user.isFirstLogin) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        user.isFirstLogin = false;
        await user.save();
        successMessage = 'Password set successfully.';

    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        refreshSecretKey,
        { expiresIn: '7d' }
    );

    const userData = {
        user : {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            mobile: user.mobile,
            isEnabled: user.isEnabled,
        },
        token: token,
        refreshToken: refreshToken
    };

    res.status(200).json({
        message: successMessage,
        data: userData
    });
};

//Token refresh
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, refreshSecretKey);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userData = {
            user : {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                mobile: user.mobile,
                isEnabled: user.isEnabled,
            },
            token: newAccessToken,
            refreshToken: refreshToken
        };

        res.json({
            message: "Success",
            data: userData,
        });
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

module.exports = { requestOTP, validateOTP, submitPassword, refreshToken };
