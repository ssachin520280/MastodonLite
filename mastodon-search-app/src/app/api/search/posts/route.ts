import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { hashtag, instances } = await req.json();
    
    if (!hashtag) {
      return NextResponse.json(
        { error: "hashtag is required" },
        { status: 400 }
      );
    }

    if (!instances || !instances.length) {
      return NextResponse.json(
        { error: "Mastodon instance URLs are required" },
        { status: 400 }
      );
    }
    
    // Search all Mastodon instances in parallel
    const searchPromises = instances.map(async (instance: string) => {
      try {
        const searchUrl = `${instance}/api/v1/timelines/tag/${hashtag}?limit=5`;
        const response = await axios.get(searchUrl);
        return {
          instance,
          posts: response.data
        };
      } catch (error) {
        console.error(`Error fetching from ${instance}:`, error);
        return {
          instance,
          posts: []
        };
      }
    });

    const results = await Promise.all(searchPromises);
    const allPosts = results.flatMap(result => result.posts);

    return NextResponse.json({ 
      hashtag: hashtag, 
      posts: allPosts,
    });
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