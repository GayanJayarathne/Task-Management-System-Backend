const User = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createUser = async (req, res) => {
    try {
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hashedPassword;
        }

        const user = new User(req.body);
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            req.body.password = hashedPassword;
        } else {
            delete req.body.password;
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            select: "-password",
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsersDropdown = async (req, res) => {
    try {
        const users = await User.find({ role: 'basic-user' }).select('firstName lastName _id').lean();

        const dropdownOptions = users.map(user => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user._id
        }));

        res.json(dropdownOptions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, getUsersDropdown };

