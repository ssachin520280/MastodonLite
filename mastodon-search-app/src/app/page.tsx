"use client";

import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

interface MastodonPost {
  content: string;
  account: {
    display_name: string;
  };
}

const fetcher = async (query: string) => {
  const res = await axios.post("/api/search", { query });
  return res.data;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const { data, error, mutate } = useSWR(query ? query : null, fetcher);

  const handleSearch = async () => {
    mutate(query);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">Mastodon Post Search</h1>

      <div className="max-w-lg mx-auto flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a topic..."
          className="w-full p-3 rounded-lg border"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-4">Error fetching posts.</p>}

      <div className="mt-6 space-y-4">
        {data?.posts?.length ? (
          data.posts.map((post: MastodonPost, index: number) => (
            <div key={index} className="bg-white p-4 shadow-lg rounded-lg">
              <p className="text-gray-700">{post.content}</p>
              <p className="text-sm text-gray-500 mt-2">By {post.account.display_name}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No posts found.</p>
        )}
      </div>
    </div>
  );
}
