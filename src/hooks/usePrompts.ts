import { useState, useEffect } from 'react';
import { PromptsData, PromptsDataSchema } from '../types/prompts';

interface UsePromptsReturn {
    data: PromptsData | null;
    loading: boolean;
    error: string | null;
}

export const usePrompts = (): UsePromptsReturn => {
    const [data, setData] = useState<PromptsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                setLoading(true);
                const response = await fetch('/prompts.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch prompts: ${response.statusText}`);
                }
                const jsonData = await response.json();

                // Validate data with Zod
                const validatedData = PromptsDataSchema.parse(jsonData);
                setData(validatedData);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(errorMessage);
                console.error('Error loading prompts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    return { data, loading, error };
};
