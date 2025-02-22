import { models } from './config';
import { queryEnhancers } from './queryEnhancers';
import { processGeminiResponse, processDeepseekResponse, processLlamaResponse } from './responseProcessors';
import { ModelResponse } from './interfaces';

export async function callGeminiAPI(query: string): Promise<ModelResponse> {
  const response = await fetch(`${models.gemini.apiUrl}?key=${models.gemini.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: queryEnhancers.gemini(query) }]
      }]
    })
  });

  if (!response.ok) throw new Error(await response.text());
  
  const rawResponse = await response.json();
  const hashtags = await processGeminiResponse(rawResponse);
  return { hashtags, raw: rawResponse };
}

export async function callDeepseekAPI(query: string): Promise<ModelResponse> {
  const response = await fetch(models.deepseek.apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${models.deepseek.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: queryEnhancers.deepseek(query) }]
    })
  });

  if (!response.ok) throw new Error(await response.text());
  
  const rawResponse = await response.json();
  const hashtags = await processDeepseekResponse(rawResponse);
  return { hashtags, raw: rawResponse };
}

export async function callLlamaAPI(query: string): Promise<ModelResponse> {
  const response = await fetch(models.llama.apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${models.llama.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: queryEnhancers.llama(query) }]
    })
  });

  if (!response.ok) throw new Error(await response.text());
  
  const rawResponse = await response.json();
  const hashtags = await processLlamaResponse(rawResponse);
  return { hashtags, raw: rawResponse };
}