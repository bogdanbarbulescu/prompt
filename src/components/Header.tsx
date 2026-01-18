import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onMenuClick }) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus search on / key press
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === '/' && !isFocused && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isFocused]);

    return (
        <header className="header">
            <button className="menu-icon" onClick={onMenuClick} aria-label="Toggle sidebar">
                <span className="material-icons-outlined">menu</span>
            </button>

            <div className="header-left">
                <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
                    <span className="material-icons-outlined search-icon">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Search prompts... (Press / to focus)"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {searchQuery && (
                        <button
                            className="clear-search"
                            onClick={() => onSearchChange('')}
                            aria-label="Clear search"
                        >
                            <span className="material-icons-outlined">close</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="header-right">
                <h1 className="app-title">
                    <span className="material-icons-outlined">model_training</span>
                    LLM Prompt Library
                </h1>
            </div>
        </header>
    );
};

export default Header;
