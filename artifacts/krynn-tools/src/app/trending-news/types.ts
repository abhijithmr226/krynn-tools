export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  image: string;
}

export interface NewsData {
  lastUpdated: string;
  totalArticles: number;
  articles: NewsArticle[];
}
