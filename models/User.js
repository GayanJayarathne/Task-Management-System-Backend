const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    mobile: {
        type: String,
        required: true,
        match: /^\+\d{1,3}\d{7,14}$/,
    },
    password: { type: String },
    address: {
        formatted: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    role: { type: String, default: 'basic-user' },
    isEnabled: { type: Boolean, default: false },
    isFirstLogin: { type: Boolean, default: true },
    otp: { type: String },
    otpExpiration: { type: Date },
}, { timestamps: true });

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    },
});

module.exports = mongoose.model("User", userSchema);
