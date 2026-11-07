import React, { useState } from 'react';
// Convert saved date to the format the time inut needs 
const toInputValue = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const TaskItem = ({ task, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editReminder, setEditReminder] = useState(toInputValue(task.reminder));

    const handleUpdate = () => {
        onUpdate(task._id, {
            title: editTitle,
            description: editDescription,
            reminder: editReminder ? new Date(editReminder).toISOString() : null
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
                        <p>⏰ Reminder: {new Date(task.reminder).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })}</p>
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