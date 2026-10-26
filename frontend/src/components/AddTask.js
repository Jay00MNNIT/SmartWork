import React, { useState } from 'react';

const AddTask = ({ onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reminder, setReminder] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('other');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;
        onAdd({ title, description, reminder, priority, category });
        setTitle('');
        setDescription('');
        setReminder('');
        setPriority('medium');
        setCategory('other');
    };

    return (
        <div className="add-task">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeHolder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Task Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                />
                <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="high">🔴 High Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="low">🟢 Low Priority</option>
                </select>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                <option value="study">📚 Study</option>
                <option value="work">💼 Work</option>
                <option value="personal">🏃🏾‍♂️ Personal</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="other">📝 Other</option>
                </select>

                <button type="submit">+ Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;