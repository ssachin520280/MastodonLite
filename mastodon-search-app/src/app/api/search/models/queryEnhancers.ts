import { ModelName } from './config';

const basePrompt = (query: string) => `
I want to search for: ${query}
Return only a comma-separated list of hashtags (without # symbol), ordered by relevance which I can use to search on mastodon servers. For example: "topic1, topic2, topic3"
`;

export const queryEnhancers: Record<ModelName, (query: string) => string> = {
  gemini: basePrompt,
  deepseek: basePrompt,
  llama: basePrompt
};