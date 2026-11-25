import { MetadataRoute } from 'next';
import { getBlogs, getProducts, getApplications } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.frklighting.com';

  const [blogs, products, applications] = await Promise.all([
    getBlogs(),
    getProducts(),
    getApplications(),
  ]);

  const publishedBlogs = blogs.filter((b) => b.published !== false);
  const activeProducts = products.filter((p) => p.is_active !== false);

  const blogUrls = publishedBlogs.map((blog) => {
    let lastMod = new Date();
    if (blog.updated_at) {
      const d = new Date(blog.updated_at);
      if (!isNaN(d.getTime())) lastMod = d;
    } else if (blog.created_at) {
      const d = new Date(blog.created_at);
      if (!isNaN(d.getTime())) lastMod = d;
    }

    return {
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: lastMod,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  const productUrls = activeProducts.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const applicationUrls = applications.map((app) => ({
    url: `${baseUrl}/applications/${app.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    '',
    '/products',
    '/applications',
    '/about',
    '/blog',
    '/contact',
    '/customer-stories',
    '/installation-services',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...productUrls, ...applicationUrls, ...blogUrls];
}
