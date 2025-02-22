"use client";

import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { PostCard } from '../components/PostCard';
import type { SearchResponse } from '../types';

const fetcher = async (query: string) => {
  const res = await axios.post("/api/search", { query });
  return res.data;
};

const postsFetcher = async (query: unknown) => {
  const res = await axios.post("/api/search/posts", query);
  return res.data;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [postsQuery, setPostsQuery] = useState<{hashtag: string, instance: string}>({hashtag: "", instance: ""});
  const [selectedInstance, setSelectedInstance] = useState("https://mastodon.social");
  const { data, error } = useSWR<SearchResponse>(searchQuery ? searchQuery : null, fetcher);
  const { data: postsData, error: postsError } = useSWR<SearchResponse>(postsQuery && postsQuery.hashtag && postsQuery.instance ? postsQuery : null, postsFetcher);

  const handleSearch = async () => {
    setSearchQuery(query);
  };

  const handlePosts = async (tag: string) => {
    setPostsQuery({hashtag: tag, instance: selectedInstance})
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-center mb-6">Mastodon Post Search</h1>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex gap-2">
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

        <input
          type="text"
          value={selectedInstance}
          onChange={(e) => setSelectedInstance(e.target.value)}
          placeholder="Mastodon instance URL..."
          className="w-full p-3 rounded-lg border"
        />

        {data?.hashtags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {data.hashtags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handlePosts(tag)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-center mt-4">Error fetching tags.</p>}

      <div className="mt-6 space-y-4">
        {postsData?.posts?.length ? (
          postsData.posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No posts found.</p>
        )}
      </div>

      {postsError && <p className="text-red-500 text-center mt-4">Error fetching posts.</p>}
    </div>
  );
}
