import React from 'react';
import { Prompt } from '../types/prompts';
import PromptCard from './PromptCard';
import { generatePromptId } from '../hooks/useFavorites';
import './PromptList.css';

interface PromptListProps {
    prompts: Prompt[];
    title: string;
    emptyMessage: string;
    category?: string;
    isFavorite?: (promptId: string) => boolean;
    onToggleFavorite?: (prompt: Prompt, category?: string) => void;
    onCopy?: (prompt: Prompt, category?: string) => void;
}

const PromptList: React.FC<PromptListProps> = ({
    prompts,
    title,
    emptyMessage,
    category,
    isFavorite,
    onToggleFavorite,
    onCopy,
}) => {
    if (prompts.length === 0) {
        return (
            <div className="prompt-list">
                <div className="prompt-list-header">
                    <h1>{title}</h1>
                </div>
                <div className="empty-state">
                    <span className="material-icons-outlined">inbox</span>
                    <p>{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="prompt-list">
            <div className="prompt-list-header">
                <h1>{title}</h1>
                <span className="prompt-count">{prompts.length} prompts</span>
            </div>

            <div className="prompts-grid">
                {prompts.map((prompt, index) => {
                    const promptId = generatePromptId(prompt, category);
                    return (
                        <PromptCard
                            key={`${prompt.title}-${index}`}
                            prompt={prompt}
                            category={category}
                            isFavorite={isFavorite?.(promptId) ?? false}
                            onToggleFavorite={
                                onToggleFavorite ? () => onToggleFavorite(prompt, category) : undefined
                            }
                            onCopy={onCopy ? () => onCopy(prompt, category) : undefined}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default PromptList;

