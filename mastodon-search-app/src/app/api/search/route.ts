import { NextResponse } from "next/server";
import { models, ModelName } from './models/config';
import { ModelResponse } from './models/interfaces';
import { callGeminiAPI, callDeepseekAPI, callLlamaAPI } from './models/apiCallers';

const modelAPIs: Record<ModelName, (query: string) => Promise<ModelResponse>> = {
  gemini: callGeminiAPI,
  deepseek: callDeepseekAPI,
  llama: callLlamaAPI
};

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const results: Record<string, ModelResponse | { error: string }> = {};

    // Sort models by priority
    const sortedModels = Object.entries(models)
      .sort(([, a], [, b]) => a.priority - b.priority);

    // Try models in priority order until we get a successful response
    for (const [modelName, config] of sortedModels) {
      if (!config.enabled) continue;
      if (!config.apiKey) {
        results[modelName] = { error: `${modelName.toUpperCase()}_API_KEY is not configured` };
        continue;
      }

      try {
        const result = await modelAPIs[modelName as ModelName](query);
        results[modelName] = result;
        
        // If we got hashtags successfully, break the loop
        if (result.hashtags && result.hashtags.length > 0) {
          break;
        }
      } catch (error) {
        results[modelName] = { error: `${modelName} API error: ${error}` };
      }
    }

    // Get hashtags from the successful response (should only be one)
    const allHashtags = Object.values(results)
      .flatMap(result => 'hashtags' in result ? result.hashtags : []);
    const uniqueHashtags = [...new Set(allHashtags)];

    return NextResponse.json({ 
      results,
      hashtags: uniqueHashtags
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
