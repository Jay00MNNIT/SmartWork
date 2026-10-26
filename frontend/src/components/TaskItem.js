import React, { useState } from 'react';

const TaskItem = ({ task, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editReminder, setEditReminder] = useState(task.reminder);

    const handleUpdate = () => {
        onUpdate(task._id, {
            title: editTitle,
            description: editDescription,
            reminder: editReminder
        });
        setIsEditing(false);
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''} ${task.priority}`}>
            {isEditing ? (
                <div className="edit-mode">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        value={editReminder}
                        onChange={(e) => setEditReminder(e.target.value)}
                    />
                    <button onClick={handleUpdate}> Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div className="view-mode">
                    <h3>
                        {task.priority === 'high' && '🔴 '}
                        {task.priority === 'medium' && '🟡 '}
                        {task.priority === 'low' && '🟢 '}
                        {task.title}
                    </h3>
                    <p className="task-category">
                        {task.category === 'study' && '📚 Study'}
                        {task.category === 'work' && '💼 Work'}
                        {task.category === 'personal' && '🏃🏾‍♂️ Personal'}
                        {task.category === 'shopping' && '🛒 Shopping'}
                        {task.category === 'other' && '📝 Other'}
                    </p>
                    <p>{task.description}</p>
                    {task.reminder && (
                        <p>Reminder: {new Date(task.reminder).toLocaleString()}</p>
                    )}
                    <div className="task-buttons">
                        <button onClick={() => onUpdate(task._id, { completed: !task.completed })}>
                            {task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(task._id)}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItem;