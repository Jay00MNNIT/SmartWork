import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onUpdate }) => {
    // Find next incomplete task in queue 
    const nextTask = tasks.find(task => !task.completed);

    return (
        <div className="task-list">
            {nextTask && (
                <div className="next-task-banner">
                    Next Task: <strong>{nextTask.title}</strong>
                </div>
            )}
            {tasks.length === 0 ? (
                <div className="no-tasks">
                    <p>No tasks yet! Add your first task above.</p>
                </div>
            ) : (
                tasks.map(task => (
                    <TaskItem
                        key={task._id}
                        task={task}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))
            )}
        </div>
    );
};

export default TaskList;