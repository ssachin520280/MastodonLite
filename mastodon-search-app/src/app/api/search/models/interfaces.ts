export interface ModelResponse {
  hashtags: string[];
  raw: unknown;
}

export interface GeminiResponse {
  candidates?: [{
    content: {
      parts: [{
        text: string
      }]
    }
  }]
}

export interface LLMResponse {
  choices?: [{
    message: {
      content: string
    }
  }]
}