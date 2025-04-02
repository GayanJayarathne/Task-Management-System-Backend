const User = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found.');
            return res.status(404).json({ message: 'User not found.' });
        }

        let successMessage = 'Authentication successful';

        if (user.isFirstLogin) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = hashedPassword;
            user.isFirstLogin = false;
            await user.save();
            successMessage = 'Password set successfully on first login.';
            console.log('Password set successfully on first login.');
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('Invalid password.');
                return res.status(401).json({ message: 'Invalid password.' });
            }
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            secretKey,
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
            token: token
        };

        console.log('Authentication successful.');
        return res.status(200).json({message:successMessage,data:userData});
    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};




module.exports = { authenticateUser };
