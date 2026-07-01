export type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  publishedAt: string;
  author: string;
  tags: string[];
  rating?: number;
  category?: string;
};
