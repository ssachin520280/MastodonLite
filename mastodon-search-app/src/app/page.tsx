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
  const [postsQuery, setPostsQuery] = useState<{hashtag: string, instances: string[]}>({hashtag: "", instances: []});
  const [selectedInstances, setSelectedInstances] = useState<{[key: string]: boolean}>({
    "https://mastodon.social": true,
    "https://infosec.exchange": false,
    "https://mas.to": false,
  });
  
  const { data, error } = useSWR<SearchResponse>(searchQuery ? searchQuery : null, fetcher);
  const { data: postsData, error: postsError } = useSWR<SearchResponse>(
    postsQuery && postsQuery.hashtag && postsQuery.instances.length > 0 ? postsQuery : null, 
    postsFetcher
  );

  const handleSearch = async () => {
    setSearchQuery(query);
  };

  const handleInstanceToggle = (instance: string) => {
    setSelectedInstances(prev => ({
      ...prev,
      [instance]: !prev[instance]
    }));
  };

  const handlePosts = async (tag: string) => {
    const activeInstances = Object.entries(selectedInstances)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, isSelected]) => isSelected)
      .map(([instance]) => instance);
    
    setPostsQuery({hashtag: tag, instances: activeInstances});
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

        <div className="flex flex-col gap-2">
          {Object.entries(selectedInstances).map(([instance, isSelected]) => (
            <label key={instance} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleInstanceToggle(instance)}
                className="h-4 w-4"
              />
              <span>{instance}</span>
            </label>
          ))}
        </div>

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
