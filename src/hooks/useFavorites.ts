import { useState, useEffect, useCallback } from 'react';
import { Prompt } from '../types/prompts';

const FAVORITES_KEY = 'prompt-library-favorites';
const RECENT_KEY = 'prompt-library-recent';
const MAX_RECENT = 10;

export interface StoredPrompt extends Prompt {
    id: string;
    category?: string;
    addedAt?: number;
}

// Generate a unique ID for a prompt
export const generatePromptId = (prompt: Prompt, category?: string): string => {
    return `${category || 'unknown'}-${prompt.title.replace(/\s+/g, '-').toLowerCase()}`;
};

interface UseFavoritesReturn {
    favorites: StoredPrompt[];
    recentlyUsed: StoredPrompt[];
    isFavorite: (promptId: string) => boolean;
    toggleFavorite: (prompt: Prompt, category?: string) => void;
    addToRecent: (prompt: Prompt, category?: string) => void;
    clearRecent: () => void;
    clearFavorites: () => void;
}

export const useFavorites = (): UseFavoritesReturn => {
    const [favorites, setFavorites] = useState<StoredPrompt[]>([]);
    const [recentlyUsed, setRecentlyUsed] = useState<StoredPrompt[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_KEY);
            const storedRecent = localStorage.getItem(RECENT_KEY);

            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
            if (storedRecent) {
                setRecentlyUsed(JSON.parse(storedRecent));
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }, []);

    // Save favorites to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }, [favorites]);

    // Save recent to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyUsed));
        } catch (error) {
            console.error('Error saving recent:', error);
        }
    }, [recentlyUsed]);

    const isFavorite = useCallback((promptId: string): boolean => {
        return favorites.some((fav) => fav.id === promptId);
    }, [favorites]);

    const toggleFavorite = useCallback((prompt: Prompt, category?: string) => {
        const promptId = generatePromptId(prompt, category);

        setFavorites((prev) => {
            const exists = prev.some((fav) => fav.id === promptId);

            if (exists) {
                return prev.filter((fav) => fav.id !== promptId);
            } else {
                const newFavorite: StoredPrompt = {
                    ...prompt,
                    id: promptId,
                    category,
                    addedAt: Date.now(),
                };
                return [...prev, newFavorite];
            }
        });
    }, []);

    const addToRecent = useCallback((prompt: Prompt, category?: string) => {
        const promptId = generatePromptId(prompt, category);

        setRecentlyUsed((prev) => {
            // Remove if already exists
            const filtered = prev.filter((item) => item.id !== promptId);

            // Add to beginning
            const newRecent: StoredPrompt = {
                ...prompt,
                id: promptId,
                category,
                addedAt: Date.now(),
            };

            // Keep only MAX_RECENT items
            return [newRecent, ...filtered].slice(0, MAX_RECENT);
        });
    }, []);

    const clearRecent = useCallback(() => {
        setRecentlyUsed([]);
    }, []);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    return {
        favorites,
        recentlyUsed,
        isFavorite,
        toggleFavorite,
        addToRecent,
        clearRecent,
        clearFavorites,
    };
};
