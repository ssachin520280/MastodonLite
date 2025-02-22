/* eslint-disable @next/next/no-img-element */
import { MastodonPost } from "@/types";

interface PostCardProps {
  post: MastodonPost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white p-4 sm:p-6 shadow-lg rounded-lg">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <img 
          src={post.account.avatar}
          alt={post.account.display_name}
          width={40}
          height={40}
          className="rounded-full sm:w-12 sm:h-12 w-10 h-10"
        />
        <div>
          <p className="font-semibold text-sm sm:text-base">{post.account.display_name}</p>
          <a 
            href={post.account.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-500 hover:underline"
          >
            @{post.account.username}
          </a>
        </div>
      </div>

      <div 
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="prose prose-sm sm:prose prose-blue max-w-none mb-3 sm:mb-4 [&_a:not(.mention)]:hidden [&_p]:visible [&_.invisible]:hidden"
      />

      {post.card && (
        <a 
          href={post.card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors mb-3 sm:mb-4"
        >
          <h3 className="font-semibold text-sm sm:text-base">{post.card.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{post.card.description}</p>
        </a>
      )}

      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        <div className="flex gap-2 sm:gap-4">
          <span>💬 {post.replies_count}</span>
          <span>🔁 {post.reblogs_count}</span>
          <span>⭐ {post.favourites_count}</span>
        </div>
        <a 
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View on Mastodon
        </a>
      </div>
    </div>
  );
} 