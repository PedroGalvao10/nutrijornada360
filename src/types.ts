export interface Article {
  id: number;
  title: string;
  hat: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_description: string;
  cover_image_url: string;
  image_alt: string;
  published_at: string;
  created_at: string;
  updated_at?: string;
  is_published: boolean;
  reading_time?: number;
}

export interface User {
  id: number;
  email: string;
  role: string;
}
