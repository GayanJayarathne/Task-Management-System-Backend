const Task = require("../models/Task");
const mongoose = require('mongoose');

// create task
const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();

        res.status(201).json({message: "Task Created", data: task});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// get tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate({
                path: 'userId',
                select: 'firstName lastName'
            });

        res.json({message:'Success', data:tasks});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get task by id
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json({message:"Success", data:task});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update task
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json({message:"Update Success", data:task});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// delete a task
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get tasks by user id
const getTasksByUserId = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    try {
        const tasks = await Task.find({ userId })
            .populate({
                path: 'userId',
                select: 'firstName lastName'
            });

        if (!tasks.length) {
            return res.status(404).json({ message: 'No tasks found for this user.' });
        }

        res.status(200).json({message:"succcess",data: tasks});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask, getTasksByUserId };
