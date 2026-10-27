import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getToken } from '../api/auth';

const AISuggestion = ({ onAddTask }) => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('study');

    const getAISuggestions = async () => {
        setLoading(true);
        setSuggestions([]);
        try {
            const baseURL = process.env.REACT_APP_BASE_URL || 'http.//localhost:5000';
            const response = await fetch(`${baseURL}/api/ai/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ category: selectedCategory })
            });

            const data = await response.json();

            if (data.suggestions) {
                setSuggestions(data.suggestions);
                toast.success('✅ AI suggestions loaded!');
            } else {
                toast.error('❌ Failed to get suggestions!');
            }

        } catch (error) {
            console.error('AI suggestion error:', error);
            toast.error('❌ Failed to get AI suggestions! Check API key.');
        }
        setLoading(false);
    };

        const handleAddSuggestion = (suggestion) => {
            onAddTask({
                title: suggestion.title,
                description: `${suggestion.description} (Est: ${suggestion.estimatedTime})`,
                priority: suggestion.priority,
                category: suggestion.category,
                reminder: null
            });
            toast.success(`✅ AI task "${suggestion.title}" added!`);
        };

        return (
            <div className="ai-suggestion">
                <h3>🤖 AI Task Suggestions</h3>

                {/* Category Selector */}
                <div className="ai-category-select">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="study">📚 Study</option>
                        <option value="work">💼 Work</option>
                        <option value="personal">🏃🏾‍♂️ Personal</option>
                        <option value="shopping">🛒 Shopping</option>
                        <option value="other">📝 Other</option>
                    </select>
                    <button
                        className="ai-suggest-btn"
                        onClick={getAISuggestions}
                        disabled={loading}
                    >
                        {loading ? '⏳ Getting suggestions...' : '🤖 Get AI Suggestions'}
                    </button>
                </div>

                {/* Suggestions List */}
                {suggestions.length > 0 && (
                    <div className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="ai-suggestion-item">
                                <div className="ai-suggestion-header">
                                    <span className="ai-priority">
                                        {suggestion.priority === 'high' && '🔴 '}
                                        {suggestion.priority === 'medium' && '🟡 '}
                                        {suggestion.priority === 'low' && '🟢 '}
                                    </span>
                                    <h4>{suggestion.title}</h4>
                                    <span className="ai-time">
                                        ⌚ {suggestion.esitmatedTime}
                                    </span>
                                </div>
                                <p>{suggestion.description}</p>
                                <button
                                    className="ai-add-btn"
                                    onClick={() => handleAddSuggestion(suggestion)}
                                >
                                    ➕ Add This Task
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && suggestions.length === 0 && (
                    <div className="ai-empty">
                        <p>👍 Select a category and click Get AI Suggestions!</p>
                    </div>
                )}
        </div>
    );
};

export default AISuggestion;