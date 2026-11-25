import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBlogs } from '@/lib/data';
import BlogContent, { extractFaqsFromContent } from '@/components/BlogContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blogs = await getBlogs();
  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: { absolute: 'Article Not Found | FRK Lighting' },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.frklighting.com';
  const url = `${baseUrl}/blog/${blog.slug}`;
  const imageUrl = blog.image_url
    ? (blog.image_url.startsWith('http')
        ? blog.image_url
        : `${baseUrl}${blog.image_url.startsWith('/') ? '' : '/'}${blog.image_url}`)
    : `${baseUrl}/images/frk-logo.png`;

  // Custom meta title or clean title kept under ~60 characters
  const customMetaTitle = (blog as any).meta_title;
  let finalTitle = customMetaTitle ? customMetaTitle.trim() : blog.title.trim();
  if (!finalTitle.toLowerCase().includes('frk') && finalTitle.length < 42) {
    finalTitle = `${finalTitle} | FRK Lighting`;
  }

  return {
    title: {
      absolute: finalTitle,
    },
    description: blog.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: finalTitle,
      description: blog.excerpt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      publishedTime: blog.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: blog.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blogs = await getBlogs();
  const publishedBlogs = blogs.filter((b) => b.published !== false);
  const currentIndex = publishedBlogs.findIndex((b) => b.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const blog = publishedBlogs[currentIndex];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://www.frklighting.com';
  const pageUrl = `${baseUrl}/blog/${blog.slug}`;
  const featuredImageUrl = blog.image_url
    ? (blog.image_url.startsWith('http')
        ? blog.image_url
        : `${baseUrl}${blog.image_url.startsWith('/') ? '' : '/'}${blog.image_url}`)
    : `${baseUrl}/images/frk-logo.png`;

  // Previous and Next Blog Navigation
  const prevBlog = blog.prev_blog_id
    ? publishedBlogs.find((b) => b.id === blog.prev_blog_id) || (currentIndex > 0 ? publishedBlogs[currentIndex - 1] : null)
    : (currentIndex > 0 ? publishedBlogs[currentIndex - 1] : null);

  const nextBlog = blog.next_blog_id
    ? publishedBlogs.find((b) => b.id === blog.next_blog_id) || (currentIndex < publishedBlogs.length - 1 ? publishedBlogs[currentIndex + 1] : null)
    : (currentIndex < publishedBlogs.length - 1 ? publishedBlogs[currentIndex + 1] : null);

  // Related Blogs
  const relatedBlogs =
    blog.related_blog_ids && blog.related_blog_ids.length > 0
      ? publishedBlogs.filter((b) => blog.related_blog_ids?.includes(b.id) && b.id !== blog.id)
      : publishedBlogs.filter((b) => b.id !== blog.id && b.id !== prevBlog?.id && b.id !== nextBlog?.id).slice(0, 3);

  // Structured Data (Article JSON-LD)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: featuredImageUrl,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    mainEntityOfPage: pageUrl,
    author: {
      '@type': 'Organization',
      name: 'FRK Lighting Solutions',
      url: 'https://www.frklighting.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FRK Lighting Solutions',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/frk-logo.png`,
      },
    },
  };

  // Structured Data (FAQPage JSON-LD)
  const faqs = extractFaqsFromContent(blog.content, blog.slug);
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="py-12 pb-24 max-w-[800px] mx-auto px-4 sm:px-6 space-y-8">
        {/* Back to blog list */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#5b605b] hover:text-[#1f2220] text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Blogs</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4 border-b border-[#e4e2da] pb-6">
          <span className="text-xs text-[#5b605b] font-mono">
            {new Date(blog.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1f2220] leading-tight">
            {blog.title}
          </h1>
          <p className="text-base text-[#5b605b] italic">{blog.excerpt}</p>

          {blog.image_url && (
            <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-[#f6f4ee] border border-[#e4e2da] my-4">
              <Image
                src={blog.image_url}
                alt={blog.title}
                fill
                sizes="(max-width: 800px) 100vw, 800px"
                priority
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        {/* Article Content with Markdown & GFM Tables Rendering */}
        <BlogContent content={blog.content} blogTitle={blog.title} />

        {/* Previous & Next Blog Navigation */}
        <div className="pt-8 border-t border-[#e4e2da] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevBlog ? (
            <Link
              href={`/blog/${prevBlog.slug}`}
              className="p-4 rounded-lg border border-[#e4e2da] bg-[#f6f4ee] hover:bg-[#e4e2da]/60 transition-all space-y-1 block group"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9a6f0c] font-mono flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous Article
              </span>
              <h4 className="text-sm font-bold font-serif text-[#1f2220] group-hover:underline line-clamp-2">
                {prevBlog.title}
              </h4>
            </Link>
          ) : (
            <div />
          )}

          {nextBlog ? (
            <Link
              href={`/blog/${nextBlog.slug}`}
              className="p-4 rounded-lg border border-[#e4e2da] bg-[#f6f4ee] hover:bg-[#e4e2da]/60 transition-all space-y-1 block text-right group"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9a6f0c] font-mono flex items-center justify-end gap-1">
                Next Article <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-sm font-bold font-serif text-[#1f2220] group-hover:underline line-clamp-2">
                {nextBlog.title}
              </h4>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Related Blogs Recommendations */}
        {relatedBlogs.length > 0 && (
          <div className="pt-10 space-y-6 border-t border-[#e4e2da]">
            <h3 className="text-2xl font-bold font-serif text-[#1f2220]">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="bg-white border border-[#e4e2da] rounded-lg p-4 space-y-2 hover:bg-[#f6f4ee] transition-all block group"
                >
                  {rel.image_url && (
                    <div className="relative aspect-[16/9] rounded overflow-hidden bg-[#f6f4ee] mb-2">
                      <Image
                        src={rel.image_url}
                        alt={rel.title}
                        fill
                        sizes="250px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <h4 className="text-sm font-bold font-serif text-[#1f2220] group-hover:underline line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#5b605b] line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
