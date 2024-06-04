const express = require("express");
const router = express.Router();
const TodoTask = require("../models/todoTask");
const { verifyToken } = require("./auth"); 

// Get all tasks for the logged-in user
router.get("/", verifyToken, async (req, res) => {
    try {
        const tasks = await TodoTask.find({ user: req.userId });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new task for the logged-in user
router.post("/", verifyToken, async (req, res) => {
    // Log the incoming request body
    console.log("Received new task data:", req.body); 

    const task = new TodoTask({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        subTasks: req.body.subTasks,
        // Assign the task to the logged-in user
        user: req.userId 
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        // Log any errors
        console.error("Error creating task:", err.message); 
        res.status(400).json({ message: err.message });
    }
});

// Update task
router.patch("/:id", verifyToken, async (req, res) => {
    try {
        const task = await TodoTask.findOne({ _id: req.params.id, user: req.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (req.body.title != null) {
            task.title = req.body.title;
        }
        if (req.body.description != null) {
            task.description = req.body.description;
        }
        if (req.body.priority != null) {
            task.priority = req.body.priority;
        }
        if (req.body.dueDate != null) {
            task.dueDate = req.body.dueDate;
        }
        if (req.body.completed != null) {
            task.completed = req.body.completed;
        }
        if (req.body.subTasks != null) {
            task.subTasks = req.body.subTasks;
        }
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get task by ID
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const task = await TodoTask.findOne({ _id: req.params.id, user: req.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete task
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const task = await TodoTask.findOne({ _id: req.params.id, user: req.userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await TodoTask.deleteOne({ _id: req.params.id });
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;