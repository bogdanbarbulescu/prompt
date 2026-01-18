import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Prompt } from '../types/prompts';
import './VariableFillModal.css';

interface VariableFillModalProps {
    prompt: Prompt;
    isOpen: boolean;
    onClose: () => void;
    onCopy: (filledPrompt: string) => void;
}

// Extract variables from prompt text (e.g., {variable_name})
const extractVariables = (text: string): string[] => {
    const regex = /\{([^}]+)\}/g;
    const matches: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (!matches.includes(match[1])) {
            matches.push(match[1]);
        }
    }

    return matches;
};

// Format variable name for display
const formatVariableName = (name: string): string => {
    return name
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const VariableFillModal: React.FC<VariableFillModalProps> = ({
    prompt,
    isOpen,
    onClose,
    onCopy,
}) => {
    const [values, setValues] = useState<Record<string, string>>({});
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    const variables = useMemo(() => extractVariables(prompt.prompt), [prompt.prompt]);

    // Reset values when prompt changes
    useEffect(() => {
        setValues({});
        setCopied(false);
    }, [prompt]);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen && firstInputRef.current) {
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleValueChange = (variable: string, value: string) => {
        setValues((prev) => ({ ...prev, [variable]: value }));
    };

    const filledPrompt = useMemo(() => {
        let result = prompt.prompt;
        variables.forEach((variable) => {
            const value = values[variable] || `{${variable}}`;
            result = result.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
        });
        return result;
    }, [prompt.prompt, variables, values]);

    const allFilled = useMemo(() => {
        return variables.every((v) => values[v]?.trim());
    }, [variables, values]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(filledPrompt);
            setCopied(true);
            onCopy(filledPrompt);
            setTimeout(() => {
                setCopied(false);
                onClose();
            }, 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleCopyRaw = async () => {
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            setCopied(true);
            onCopy(prompt.prompt);
            setTimeout(() => {
                setCopied(false);
                onClose();
            }, 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!isOpen) return null;

    // If no variables, show simple copy modal
    if (variables.length === 0) {
        return (
            <div className="modal-overlay">
                <div className="modal-content" ref={modalRef}>
                    <div className="modal-header">
                        <h2>{prompt.title}</h2>
                        <button className="modal-close" onClick={onClose} aria-label="Close">
                            <span className="material-icons-outlined">close</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="prompt-preview">
                            <pre><code>{prompt.prompt}</code></pre>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className={`btn-primary ${copied ? 'copied' : ''}`}
                            onClick={handleCopyRaw}
                        >
                            <span className="material-icons-outlined">
                                {copied ? 'check_circle' : 'content_copy'}
                            </span>
                            {copied ? 'Copied!' : 'Copy Prompt'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content modal-large" ref={modalRef}>
                <div className="modal-header">
                    <div>
                        <h2>{prompt.title}</h2>
                        <p className="modal-subtitle">Fill in the variables below</p>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <span className="material-icons-outlined">close</span>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="variables-section">
                        <h3>
                            <span className="material-icons-outlined">edit</span>
                            Variables ({variables.length})
                        </h3>
                        <div className="variables-grid">
                            {variables.map((variable, index) => (
                                <div key={variable} className="variable-field">
                                    <label htmlFor={`var-${variable}`}>
                                        {formatVariableName(variable)}
                                    </label>
                                    <input
                                        ref={index === 0 ? firstInputRef : null}
                                        id={`var-${variable}`}
                                        type="text"
                                        placeholder={`Enter ${formatVariableName(variable).toLowerCase()}...`}
                                        value={values[variable] || ''}
                                        onChange={(e) => handleValueChange(variable, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="preview-section">
                        <h3>
                            <span className="material-icons-outlined">preview</span>
                            Preview
                        </h3>
                        <div className="prompt-preview">
                            <pre><code>{filledPrompt}</code></pre>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={handleCopyRaw}>
                        <span className="material-icons-outlined">content_copy</span>
                        Copy Raw
                    </button>
                    <button
                        className={`btn-primary ${copied ? 'copied' : ''} ${!allFilled ? 'partial' : ''}`}
                        onClick={handleCopy}
                    >
                        <span className="material-icons-outlined">
                            {copied ? 'check_circle' : 'send'}
                        </span>
                        {copied ? 'Copied!' : allFilled ? 'Copy Filled Prompt' : 'Copy (Partial)'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VariableFillModal;
