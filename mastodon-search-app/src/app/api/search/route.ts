import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const enhance_query = (query: string) => {
  return `I want to search for:          
            ${query}
            Return only a comma-separated list of hashtags (without # symbol), ordered by relevance which I can use to search on mestodon servers. For example: "topic1, topic2, topic3"`
}

// Model response types
interface GeminiResponse {
  candidates?: [{
    content: {
      parts: [{
        text: string
      }]
    }
  }]
}

type ModelResponse = GeminiResponse;

function convertTolist(response: ModelResponse, maxRetries = 3): string[] {
  try {
    let text: string | undefined;

    // Gemini format
    if ('candidates' in response && response.candidates?.[0]?.content?.parts?.[0]?.text) {
      text = response.candidates[0].content.parts[0].text;
    }

    if (!text) {
      throw new Error("Could not extract text from model response");
    }

    // Process the text into hashtags
    const hashtags = text
      .replace(/[\[\]"'\n]/g, '') // Remove brackets, quotes, and newlines
      .split(',')
      .map(tag => tag.trim()
        .toLowerCase()
        .replace(/\s+/g, '')) // Remove spaces within tags
      .filter(tag => tag.length > 0);

    // Validate that we got a proper list of hashtags
    if (hashtags.length === 0 && maxRetries > 0) {
      // If we didn't get any hashtags and have retries left, try again
      return convertTolist(response, maxRetries - 1);
    }

    return hashtags;
  } catch (error) {
    console.error('Error converting response to list:', error);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query)
      return NextResponse.json({ error: "Query is required" }, { status: 400 });

    // Step 1: Convert query to hashtags using Gemini API
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: enhance_query(query),
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: `Gemini API error: ${error}` },
        { status: response.status }
      )
    }

    const rawResponse = await response.json()
    const hashtags = convertTolist(rawResponse);

    // Step 2: Search Mastodon posts with the generated hashtags

    return NextResponse.json({ rawResponse: {rawResponse}, hashtags });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error:", error.response?.data || error.message);
    } else {
      console.error("Error:", error);
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
