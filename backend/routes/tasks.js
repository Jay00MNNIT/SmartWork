const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         completed:
 *           type: boolean
 *           default: false
 *         reminder:
 *           type: string
 *           format: date-time
 *         priority:
 *           type: string
 *           enum: [high, medium, low]
 *           default: medium
 *         category:
 *           type: string
 *           enum: [study, work, personal, shopping, other]
 *           default: other
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: SmartWork Task Management API
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of all tasks
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ 
            userId: req.userId 
        }).sort({ order: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Add a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               reminder:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [high, medium, low]
 *               category:
 *                 type: string
 *                 enum: [study, work, personal, shopping, other]
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            reminder: req.body.reminder,
            order: req.body.order,
            priority: req.body.priority,
            category: req.body.category,
            userId: req.userId
        });
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               priority:
 *                 type: string
 *                 enum: [high, medium, low]
 *               category:
 *                 type: string
 *                 enum: [study, work, personal, shopping, other]
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: '✅ Task deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;