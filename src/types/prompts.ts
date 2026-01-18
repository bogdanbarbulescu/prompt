import { z } from 'zod';

// Schema for individual prompt
export const PromptSchema = z.object({
    title: z.string(),
    prompt: z.string(),
    language: z.string(),
});

// Schema for the entire prompts data structure
export const PromptsDataSchema = z.record(z.string(), z.array(PromptSchema));

// TypeScript types derived from schemas
export type Prompt = z.infer<typeof PromptSchema>;
export type PromptsData = z.infer<typeof PromptsDataSchema>;
export type CategoryName = string;

// Category with metadata
export interface Category {
    name: string;
    displayName: string;
    icon: string;
    count: number;
}

// Category statistics
export interface CategoryStats {
    totalPrompts: number;
    totalCategories: number;
    categories: Category[];
}
