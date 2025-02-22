export const models = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    apiUrl: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    enabled: true,
    priority: 1
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    apiUrl: "https://api.deepseek.com/v1/chat/completions",
    enabled: true,
    priority: 2
  },
  llama: {
    apiKey: process.env.LLAMA_API_KEY,
    apiUrl: "https://api.llama-api.com/chat/completions",
    enabled: true,
    priority: 3
  }
} as const;

export type ModelName = keyof typeof models;