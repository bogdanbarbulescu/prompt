import { useState, useCallback, useMemo } from 'react';
import { Prompt, PromptsData } from '../types/prompts';

interface UseSearchReturn {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Prompt[];
    hasSearchResults: boolean;
}

export const useSearch = (data: PromptsData | null): UseSearchReturn => {
    const [searchQuery, setSearchQuery] = useState('');

    const searchResults = useMemo(() => {
        if (!data || !searchQuery.trim()) {
            return [];
        }

        const query = searchQuery.toLowerCase();
        const results: Prompt[] = [];

        Object.values(data).forEach((prompts) => {
            prompts.forEach((prompt) => {
                const titleMatch = prompt.title.toLowerCase().includes(query);
                const promptMatch = prompt.prompt.toLowerCase().includes(query);

                if (titleMatch || promptMatch) {
                    results.push(prompt);
                }
            });
        });

        return results;
    }, [data, searchQuery]);

    const hasSearchResults = searchResults.length > 0;

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        hasSearchResults,
    };
};
