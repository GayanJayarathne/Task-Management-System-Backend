const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    dateRange: {
        startDate:  { type: String },
        endDate: { type: String }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isEnabled: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    completionDate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
