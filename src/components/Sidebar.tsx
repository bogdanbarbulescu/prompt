import React from 'react';
import { Category } from '../types/prompts';
import './Sidebar.css';

interface SidebarProps {
    categories: Category[];
    selectedCategory: string;
    onCategorySelect: (categoryName: string) => void;
    isOpen: boolean;
    onClose: () => void;
    favoritesCount?: number;
    recentCount?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
    categories,
    selectedCategory,
    onCategorySelect,
    isOpen,
    onClose,
    favoritesCount = 0,
    recentCount = 0,
}) => {
    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    {/* Dashboard */}
                    <button
                        className={`category-item ${selectedCategory === 'dashboard' ? 'active' : ''}`}
                        onClick={() => onCategorySelect('dashboard')}
                    >
                        <span className="material-icons-outlined">dashboard</span>
                        <span className="category-name">Dashboard</span>
                    </button>

                    {/* Quick Access Section */}
                    <div className="category-divider">
                        <span>Quick Access</span>
                    </div>

                    <button
                        className={`category-item special ${selectedCategory === 'favorites' ? 'active' : ''}`}
                        onClick={() => onCategorySelect('favorites')}
                    >
                        <span className="material-icons-outlined">star</span>
                        <span className="category-name">Favorites</span>
                        {favoritesCount > 0 && (
                            <span className="category-count highlight">{favoritesCount}</span>
                        )}
                    </button>

                    <button
                        className={`category-item special ${selectedCategory === 'recent' ? 'active' : ''}`}
                        onClick={() => onCategorySelect('recent')}
                    >
                        <span className="material-icons-outlined">history</span>
                        <span className="category-name">Recently Used</span>
                        {recentCount > 0 && (
                            <span className="category-count">{recentCount}</span>
                        )}
                    </button>

                    {/* Categories Section */}
                    <div className="category-divider">
                        <span>Categories</span>
                    </div>

                    {categories.map((category) => (
                        <button
                            key={category.name}
                            className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                            onClick={() => onCategorySelect(category.name)}
                        >
                            <span className="material-icons-outlined">{category.icon}</span>
                            <span className="category-name">{category.displayName}</span>
                            <span className="category-count">{category.count}</span>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;

