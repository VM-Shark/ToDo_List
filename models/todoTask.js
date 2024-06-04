const mongoose = require("mongoose");

const subTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const todoTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"]
    },
    dueDate: {
        type: Date,
        default: null
    },
    subTasks: [subTaskSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const TodoTask = mongoose.model("TodoTask", todoTaskSchema);

module.exports = TodoTask;