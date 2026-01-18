import React, { useState } from 'react';
import { Prompt } from '../types/prompts';
import VariableFillModal from './VariableFillModal';
import './PromptCard.css';

interface PromptCardProps {
    prompt: Prompt;
    category?: string;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onCopy?: () => void;
}

// Check if prompt has variables
const hasVariables = (text: string): boolean => {
    return /\{[^}]+\}/.test(text);
};

const PromptCard: React.FC<PromptCardProps> = ({
    prompt,
    category,
    isFavorite = false,
    onToggleFavorite,
    onCopy,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCopyClick = () => {
        // If has variables, open modal; otherwise copy directly
        if (hasVariables(prompt.prompt)) {
            setIsModalOpen(true);
        } else {
            handleDirectCopy();
        }
    };

    const handleDirectCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            onCopy?.();
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleModalCopy = () => {
        onCopy?.();
    };

    const promptHasVars = hasVariables(prompt.prompt);

    return (
        <>
            <div className="prompt-card glass">
                <div className="prompt-card-header">
                    <h3>{prompt.title}</h3>
                    <div className="prompt-actions">
                        {onToggleFavorite && (
                            <button
                                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                                onClick={onToggleFavorite}
                                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <span className="material-icons-outlined">
                                    {isFavorite ? 'star' : 'star_outline'}
                                </span>
                            </button>
                        )}
                        <span className="language-badge">{prompt.language}</span>
                        <button
                            className="copy-button"
                            onClick={handleCopyClick}
                            aria-label="Copy to clipboard"
                        >
                            <span className="material-icons-outlined">
                                {promptHasVars ? 'edit_note' : 'content_copy'}
                            </span>
                            {promptHasVars ? 'Fill & Copy' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="prompt-content">
                    <pre>
                        <code>{prompt.prompt}</code>
                    </pre>
                </div>
            </div>

            <VariableFillModal
                prompt={prompt}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCopy={handleModalCopy}
            />
        </>
    );
};

export default PromptCard;

