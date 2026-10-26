const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    reminder: {
        type: Date, 
        default: null
    },
    order: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['study', 'work', 'personal', 'shopping', 'other'],
        default: 'other'
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
