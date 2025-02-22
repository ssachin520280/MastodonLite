import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { hashtag, instance } = await req.json();
    
    if (!hashtag) {
      return NextResponse.json(
        { error: "hashtag is required" },
        { status: 400 }
      );
    }

    if (!instance) {
      return NextResponse.json(
        { error: "Mastodon instance URL is required" },
        { status: 400 }
      );
    }
    
    // Search Mastodon instance
    const searchUrl = `${instance}/api/v1/timelines/tag/${hashtag}?limit=5`;
    const response = await axios.get(searchUrl);

    return NextResponse.json({ hashtag: hashtag, posts: response.data });
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