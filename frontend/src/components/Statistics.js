import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer
} from 'recharts';

const Statistics = ({ tasks }) => {

    // Pie Chart Data - Completed vs Pending 
    const statusData = [
        {
            name: 'Completed',
            value: tasks.filter(t => t.completed).length
        },
        {
            name: 'Pending',
            value: tasks.filter(t => !t.completed).length
        }
    ];

    // Bar Chart Data - Tasks by Category 
    const categoryData = [
        {
            name: '📚 Study',
            tasks: tasks.filter(t => t.category === 'study').length
        },
        {
            name: '💼 Work',
            tasks: tasks.filter(t => t.category === 'work').length
        },
        {
            name: '🏃🏾‍♂️ Personal',
            tasks: tasks.filter(t => t.category === 'personal').length
        },
        {
            name: '🛒 Shopping',
            tasks: tasks.filter(t => t.category === 'shopping').length
        },
        {
            name: '📝 Other',
            tasks: tasks.filter(t => t.category === 'other').length
        }
    ];

    // Bar Chart Data - Tasks by Priority
    const priorityData = [
        {
            name: '🔴 High',
            tasks: tasks.filter(t => t.priority === 'high').length
        },
        {
            name: '🟡 Medium',
            tasks: tasks.filter(t => t.priority === 'low').length
        },
        {
            name: '🟢 Low',
            tasks: tasks.filter(t => t.priority === 'low').length
        }
    ];

    // Pie Chart Colors 
    const COLORS = ['#00ff88', '#ff4757'];

    if (tasks.length === 0) {
        return (
            <div className="statistics empty-stats">
                <h2>📊 Statistics</h2>
                <p>Add tasks to see statistics!</p>
            </div>
        );
    }

    return (
        <div className="statistics">
            <h2>📊 Task Statistics</h2>

            {/*Summary Cards */}
            <div className="stats-summary">
                    <div className="stat-card">
                <h3>{tasks.length}</h3>
                <p>Total Tasks</p>
            </div>
            <div className="stat-card completed">
                <h3>{tasks.filter(t => t.completed).length}</h3>
                <p>Completed</p>
            </div>
            <div className="stat-card pending">
                <h3>{tasks.filter(t => !t.completed).length}</h3>
                <p>Pending</p>
            </div>
            <div className="stat-card high">
                <h3>{tasks.filter(t => t.prirority === 'high').length}</h3>
                <p>High Priority</p>
            </div>
            </div>

            {/*Completetion Progress Bar */}
            <div className="progress-section">
                <h3>Overall Progress</h3>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${tasks.length > 0}
                                ? (tasks.filter(t => t.completed).length / tasks.length) * 100
                                : 0}%`
                        }}
                    />
            </div>
            <p className="progress-text">
                {tasks.length > 0
                    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
                    : 0}% Complete
            </p>
            </div>

            {/*Pie Chart */}
            <div className="chart-section">
                <h3>Task Completion Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                        >
                            {statusData.map((entry, index) => (
                                <Cell
                                    Key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/*Category Bar Chart */}
            <div className="chart-section">
                <h3>Tasks by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="0f3460" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{
                                background: '#16213e',
                                border: '1px solid #0f3460'
                            }}
                        />
                        <Bar dataKey="tasks" fill="#00d4ff" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/*Priority Bar Chart */}
            <div className="chart-section">
            <h3>Tasks by Priority</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="0f3460" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                            contentStyle={{
                                background: '#16213460'
                            }}
                        />
                        <Bar dataKey="tasks" radius={[5, 5, 0, 0]}>
                            <Cell fill="#ff4757" />
                            <Cell fill="#f0a500" />
                            <Cell fill="#00ff88" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Statistics;