const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    dateRange: {
        startDate:  { type: String },
        endDate: { type: String }
    },
    userId: { type: String },
    isEnabled: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
