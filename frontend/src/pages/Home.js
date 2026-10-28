import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confetti from 'canvas-confetti';
import AddTask from '../components/AddTask';
import TaskList from '../components/TaskList';
import Reminder from '../components/Reminder';
import Statistics from '../components/Statistics';
import AISuggestion from '../components/AISuggestion';
import { getTasks, addTask, updateTask, deleteTask } from '../api/tasks';
import { getUser, logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
    const [filter, setFilter] = useState('all');
    const [category, setCategory] = useState('all');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [user] = useState(getUser());
    const navigate = useNavigate();

    // Fetch all tasks 
    useEffect(() => {
        fetchTasks();
    }, []);

    // Logout handler 
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Handle keyboard navigation 
    const handleKeyDown = (e) => {
        if (!showSuggestions)   return;

        // Arrow down
        if (e.key === 'ArrowDown') {
            setSelectedSuggestion(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        }

        // Arrow up 
        if (e.key === 'ArrowUp') {
            setSelectedSuggestion(prev =>
                prev > 0 ? prev - 1 : 0
            );
        }

        // Enter key 
        if (e.key === 'Enter') {
            if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
                setSearchQuery(suggestions[selectedSuggestion].title);
                setShowSuggestions(false);
                setSelectedSuggestion(-1);
            }
        }

        // Escape key 
        if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedSuggestion(-1);
        }
    };

    // Handle suggestion click 
    const handleSuggestionClick = (title) => {
        setSearchQuery(title);
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
    };

    // PWA Install 
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPrompt(e);
            setShowInstallBtn(true);
        });
    }, []);

    const handleInstallClick = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    toast.success('✅ SmartWork installed successfully!');
                }
                setInstallPrompt(null);
                setShowInstallBtn(false);
            });
        }
    };

    // Toggle dark/light mode
    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('light-mode');
    };

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            toast.error('Failed to fetch tasks!');
        }
    };

    // Add task 
    const handleAdd = async (task) => {
        try {
            const newTask = await addTask(task);
            setTasks([newTask, ...tasks]);
            toast.success('Task added successfully!');
        } catch (error) {
            toast.error('Failed to add task!');
        }
    };

    // Update task 
    const handleUpdate = async (id, updatedTask) => {
        try {
            const updated = await updateTask(id, updatedTask);
            setTasks(tasks.map(task =>
                task._id === id ? updated : task
            ));
            // Applause when task completed 
            if (updatedTask.completed) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                toast.success('Great job! Task completed!');
            }
        } catch (error) {
            toast.error(' Failed to update task!');
        }
    };

    // Delete task 
    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            setTasks(tasks.filter(task => task._id !== id));
            toast.success('Task deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete task!');
        }
    };

    // Calculate task counts 
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;

    // Suggestions list 
    const suggestions = searchQuery.trim() === '' ? [] : tasks.filter(task => {
        const title = task.title ? task.title.toLowerCase().trim() : '';
        const query = searchQuery.toLowerCase().trim();
        return title.includes(query);
    }).slice(0, 5); // Show max 5 suggestions 

    const filteredTasks = tasks 
        .filter(task => {
        // Filter by status 
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    })
        .filter(task => {
            if (category !== 'all') return task.category === category;
            return true;
        })
        .filter(task => {
            // Filter by search query 
            const title = task.title ? task.title.toLowerCase().trim() : '';
            const description = task.description ? task.description.toLowerCase().trim() : '';
            const query = searchQuery.toLowerCase().trim();
            return title.includes(query) || description.includes(query);
        });

    return (
        <div className="home">
            <div className="header">
                <h1>📋 SmartWork</h1>
                {user && (
                    <p className="welcome-text">👋🏼 Hello, {user.name}!</p>
                )}
                <p>Stay organized, stay productive!</p>
                <div className="header-buttons">
                    {showInstallBtn && (
                        <button className="install-btn" onClick={handleInstallClick}>
                            📲 Install App
                        </button>
                    )}
                    <span className="user-name">👤 {user?.name}</span>
                    <button className="mode-toggle" onClick={toggleMode}>
                        {isDarkMode ? '☀️ Light Mode' : '🌛 Dark Mode'}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                   🚪 Logout
                    </button>
                </div>
            </div>

            {/* Task Counter */}
            <div className="task-counter">
                <div className="counter-box">
                    <h3>{totalTasks}</h3>
                    <p>Total Tasks</p>
                </div>
                <div className="counter-box pending">
                    <h3>{pendingTasks}</h3>
                    <p>Pending</p>
                </div>
                <div className="counter-box completed">
                    <h3>{completedTasks}</h3>
                    <p>Completed</p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="filter-buttons">
                {/* Category Filter */}
                <div className="category-filter">
                    <button className={category === 'all' ? 'acitve' : ''} onClick={() => setCategory('all')}>📒 All</button>
                    <button className={category === 'study' ? 'active' : ''} onClick={() => setCategory('study')}>📚 Study</button>
                    <button className={category === 'work' ? 'active' : ''} onClick={() => setCategory('work')}>💼 Work</button>
                    <button className={category === 'personal' ? 'active' : ''} onClick={() => setCategory('personal')}>🏃🏾‍♂️ Personal</button>
                    <button className={category === 'shopping' ? 'active' : ''} onClick={() => setCategory('shopping')}>🛒 Shopping</button>
                    <button className={category === 'other' ? 'active' : ''} onClick={() => setCategory('other')}>📝 Other</button>
                </div>
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    📋 All ({tasks.length})
                </button>
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                    ⌛ Pending ({tasks.filter(t => !t.completed).length})
                </button>
                <button
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    ✅ Completed ({tasks.filter(t => t.completed).length})
                </button>
            </div>

            {/* Search Bar */}
            <div className="search-wrapper">
                <div className="search-bar">
                <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                        setSelectedSuggestion(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {searchQuery && (
                    <button onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                    }}> ❌ Clear</button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown"
                >
                    {suggestions.map((task, index) => (
                        <div
                            key={task._id}
                            className={`suggestion-item ${index === selectedSuggestion ? 'active' : ''}`}
                            onClick={() => handleSuggestionClick(task.title)}
                        >
                            <span className="suggestion-icon">
                                {task.priority === 'high' && '🔴'}
                                {task.prirority === 'medium' && '🟡'}
                                {task.priority === 'low' && '🟢'}
                            </span>
                            <span className="suggestion-title">{task.title}</span>
                            <span className="suggestion-category">
                                {task.category === 'study' && '📚'}
                                {task.category === 'work' && '💼'}
                                {task.category === 'personal' && '🏃🏾‍♂️'}
                                {task.category === 'shopping' && '🛒'}
                                {task.category === 'other' && '📝'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>

            {/* Statistics Toggle Button */}
            <button
                className="stats-toggle"
                onClick={() => setShowStats(!showStats)}
            >
                    {showStats ? '📝 Show Tasks' : '📊 Show Statistics'}
            </button>

            {/* Show Statistics or Tasks */}
            {showStats ? (
                <Statistics tasks={tasks} />
            ) : (
                <>  
                    {/* AI Suggestions */}
                    <AISuggestion onAddTask={handleAdd} />
                    <AddTask onAdd={handleAdd} />
                </>
            )}
            <TaskList
                tasks={filteredTasks}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
            <Reminder tasks={tasks} />
        </div>
    );
};

export default Home;