import React from 'react';
import { CategoryStats } from '../types/prompts';
import './Dashboard.css';

interface DashboardProps {
    stats: CategoryStats | null;
    onCategoryClick: (categoryName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onCategoryClick }) => {
    if (!stats) return null;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome to your LLM Prompt Library</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <div className="stat-icon">
                        <span className="material-icons-outlined">description</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalPrompts}</div>
                        <div className="stat-label">Total Prompts</div>
                    </div>
                </div>

                <div className="stat-card glass">
                    <div className="stat-icon">
                        <span className="material-icons-outlined">folder</span>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{stats.totalCategories}</div>
                        <div className="stat-label">Categories</div>
                    </div>
                </div>
            </div>

            <div className="categories-section">
                <h2>Browse by Category</h2>
                <div className="categories-grid">
                    {stats.categories.map((category) => (
                        <button
                            key={category.name}
                            className="category-card glass"
                            onClick={() => onCategoryClick(category.name)}
                        >
                            <div className="category-card-icon">
                                <span className="material-icons-outlined">{category.icon}</span>
                            </div>
                            <div className="category-card-content">
                                <h3>{category.displayName}</h3>
                                <p>{category.count} prompts</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
