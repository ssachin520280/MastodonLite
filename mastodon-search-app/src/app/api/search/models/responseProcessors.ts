import { GeminiResponse, LLMResponse } from './interfaces';

export async function processLLMResponse(text: string): Promise<string[]> {
  return text
    .replace(/[\[\]"'\n]/g, '')
    .split(',')
    .map(tag => tag.trim().toLowerCase().replace(/\s+/g, ''))
    .filter(tag => tag.length > 0);
}

export async function processGeminiResponse(response: GeminiResponse): Promise<string[]> {
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return [];
  return processLLMResponse(text);
}

export async function processDeepseekResponse(response: LLMResponse): Promise<string[]> {
  const text = response.choices?.[0]?.message?.content;
  if (!text) return [];
  return processLLMResponse(text);
}

export const processLlamaResponse = processDeepseekResponse;