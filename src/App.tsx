import { useState, useMemo } from 'react';
import { usePrompts } from './hooks/usePrompts';
import { useSearch } from './hooks/useSearch';
import { useFavorites } from './hooks/useFavorites';
import { Category, CategoryStats, Prompt } from './types/prompts';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PromptList from './components/PromptList';
import './styles/theme.css';
import './App.css';

function App() {
    const { data, loading, error } = usePrompts();
    const { searchQuery, setSearchQuery, searchResults, hasSearchResults } = useSearch(data);
    const { favorites, recentlyUsed, isFavorite, toggleFavorite, addToRecent } = useFavorites();
    const [selectedCategory, setSelectedCategory] = useState<string>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Generate category metadata
    const categories: Category[] = useMemo(() => {
        if (!data) return [];

        const categoryMap: Record<string, { name: string; icon: string; displayName: string }> = {
            general: { name: 'general', icon: 'description', displayName: 'General' },
            productivity_work_mgmt: { name: 'productivity_work_mgmt', icon: 'event_available', displayName: 'Productivity & Work' },
            analytics_data_insights: { name: 'analytics_data_insights', icon: 'bar_chart', displayName: 'Analytics & Data' },
            coding_software_dev: { name: 'coding_software_dev', icon: 'code', displayName: 'Coding & Software Dev' },
            content_creation: { name: 'content_creation', icon: 'article', displayName: 'Content Creation' },
            marketing: { name: 'marketing', icon: 'campaign', displayName: 'Marketing' },
            business_strategy: { name: 'business_strategy', icon: 'insights', displayName: 'Business Strategy' },
            customer_service: { name: 'customer_service', icon: 'support_agent', displayName: 'Customer Service' },
            learning_education: { name: 'learning_education', icon: 'school', displayName: 'Learning & Education' },
            writing: { name: 'writing', icon: 'edit_note', displayName: 'Writing' },
            personas: { name: 'personas', icon: 'edit', displayName: 'Personas' },
            advanced_techniques: { name: 'advanced_techniques', icon: 'psychology_alt', displayName: 'Advanced Techniques' },
            problem_solving: { name: 'problem_solving', icon: 'mediation', displayName: 'Problem Solving' },
            research_info_synthesis: { name: 'research_info_synthesis', icon: 'science', displayName: 'Research & Info Synth' },
            language_learning: { name: 'language_learning', icon: 'translate', displayName: 'Language Learning' },
            personal_development: { name: 'personal_development', icon: 'spa', displayName: 'Personal Dev' },
            healthcare_medical: { name: 'healthcare_medical', icon: 'local_hospital', displayName: 'Healthcare & Medical' },
            art_design: { name: 'art_design', icon: 'palette', displayName: 'Art & Design' },
            ux_ui_design: { name: 'ux_ui_design', icon: 'design_services', displayName: 'UX/UI Design' },
            image_creation: { name: 'image_creation', icon: 'image', displayName: 'Image Creation' },
            storytelling: { name: 'storytelling', icon: 'auto_stories', displayName: 'Storytelling' },
            games_puzzles: { name: 'games_puzzles', icon: 'extension', displayName: 'Games & Puzzles' },
            travel_itinerary: { name: 'travel_itinerary', icon: 'flight_takeoff', displayName: 'Travel Itinerary' },
            exam_prep: { name: 'exam_prep', icon: 'assignment_turned_in', displayName: 'Exam Prep' },
            cybersecurity: { name: 'cybersecurity', icon: 'security', displayName: 'Cybersecurity' },
            osint: { name: 'osint', icon: 'public', displayName: 'OSINT' },
            network_troubleshooting: { name: 'network_troubleshooting', icon: 'router', displayName: 'Network Troubleshoot' },
            project_management: { name: 'project_management', icon: 'account_tree', displayName: 'Project Mgmt' },
            data_analysis: { name: 'data_analysis', icon: 'analytics', displayName: 'Data Analysis' },
            email_communication: { name: 'email_communication', icon: 'mail_outline', displayName: 'Email & Communication' },
            science_research: { name: 'science_research', icon: 'biotech', displayName: 'Science/Research' },
            web_development: { name: 'web_development', icon: 'code', displayName: 'Web development' },
            regex_creation: { name: 'regex_creation', icon: 'account_tree', displayName: 'Regex Creation' },
        };

        return Object.keys(data)
            .map((key) => {
                const meta = categoryMap[key] || { name: key, icon: 'folder', displayName: key };
                return {
                    ...meta,
                    count: data[key].length,
                };
            })
            .sort((a, b) => a.displayName.localeCompare(b.displayName));
    }, [data]);

    const stats: CategoryStats | null = useMemo(() => {
        if (!data) return null;

        const totalPrompts = Object.values(data).reduce((sum, prompts) => sum + prompts.length, 0);

        return {
            totalPrompts,
            totalCategories: categories.length,
            categories,
        };
    }, [data, categories]);

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleToggleFavorite = (prompt: Prompt, category?: string) => {
        toggleFavorite(prompt, category);
    };

    const handleCopyPrompt = (prompt: Prompt, category?: string) => {
        addToRecent(prompt, category);
    };

    if (loading) {
        return (
            <div className="app-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading prompts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-container">
                <div className="error-container">
                    <span className="material-icons-outlined error-icon">error</span>
                    <h2>Error Loading Prompts</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    // Convert favorites and recent to prompts for display
    const favoritePrompts = favorites.map((f) => ({ title: f.title, prompt: f.prompt, language: f.language }));
    const recentPrompts = recentlyUsed.map((r) => ({ title: r.title, prompt: r.prompt, language: r.language }));

    const renderMainContent = () => {
        if (hasSearchResults) {
            return (
                <PromptList
                    prompts={searchResults}
                    title={`Search Results for "${searchQuery}"`}
                    emptyMessage="No prompts found matching your search."
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onCopy={handleCopyPrompt}
                />
            );
        }

        if (selectedCategory === 'dashboard') {
            return <Dashboard stats={stats} onCategoryClick={handleCategorySelect} />;
        }

        if (selectedCategory === 'favorites') {
            return (
                <PromptList
                    prompts={favoritePrompts}
                    title="Favorites"
                    emptyMessage="No favorites yet. Click the star icon on any prompt to add it here."
                    category="favorites"
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onCopy={handleCopyPrompt}
                />
            );
        }

        if (selectedCategory === 'recent') {
            return (
                <PromptList
                    prompts={recentPrompts}
                    title="Recently Used"
                    emptyMessage="No recently used prompts. Copy a prompt to see it here."
                    category="recent"
                    isFavorite={isFavorite}
                    onToggleFavorite={handleToggleFavorite}
                    onCopy={handleCopyPrompt}
                />
            );
        }

        return (
            <PromptList
                prompts={data[selectedCategory] || []}
                title={categories.find((c) => c.name === selectedCategory)?.displayName || 'Prompts'}
                emptyMessage="No prompts found in this category."
                category={selectedCategory}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onCopy={handleCopyPrompt}
            />
        );
    };

    return (
        <div className="app-container">
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onMenuClick={toggleSidebar}
            />

            <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                favoritesCount={favorites.length}
                recentCount={recentlyUsed.length}
            />

            <main className="main-content">
                {renderMainContent()}
            </main>
        </div>
    );
}

export default App;

