export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  read_time: string;
  author: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at?: string;
  prev_blog_id?: string;
  next_blog_id?: string;
  related_blog_ids?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  wattage_range?: string;
  best_for: string;
  why_choose: string;
  keep_in_mind: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface ApplicationItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url?: string;
  sort_order: number;
}

export interface Inquiry {
  id: string;
  name: string;
  contact: string;
  location?: string;
  project_type: string;
  details?: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_image_url?: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  instagram_handle: string;
  address: string;
  service_area: string;
  announcement_banner: string;
  footer_text: string;
}

export interface KeepAliveLog {
  id: string;
  timestamp: string;
  status: 'success' | 'failed';
  notes: string;
  source: 'cron' | 'manual' | 'app_keepalive';
}
