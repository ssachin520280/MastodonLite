export interface MastodonPost {
  content: string;
  created_at: string;
  url: string;
  reblogs_count: number;
  favourites_count: number;
  replies_count: number;
  account: {
    display_name: string;
    username: string;
    avatar: string;
    url: string;
  };
  card?: {
    title: string;
    description: string;
    url: string;
  };
}

export interface SearchResponse {
  hashtags: string[];
  posts?: MastodonPost[];
} 