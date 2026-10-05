import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Search } from 'lucide-react';
import { getBlogs } from '@/lib/data';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Practical guides on choosing, installing and maintaining solar street lights in Kerala.',
};

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { page, search } = await searchParams;
  const allBlogs = await getBlogs();

  let filteredBlogs = allBlogs.filter((b) => b.published !== false);

  if (search) {
    const q = search.toLowerCase();
    filteredBlogs = filteredBlogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q)
    );
  }

  // Heavy-duty Pagination Logic (6 posts per page for fast loading)
  const pageSize = 6;
  const currentPage = parseInt(page || '1', 10) || 1;
  const totalItems = filteredBlogs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-0 pb-20">
      {/* Sub Banner */}
      <section className="bg-[#f6f4ee] border-b border-[#e4e2da] py-14">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#1f2220]">Blog</h1>
          <p className="text-base text-[#5b605b] max-w-xl">
            Practical notes on choosing, installing and looking after solar street lights.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-12 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8">
          {/* Controls Bar: Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-6 border-b border-[#e4e2da]">
            <span className="text-xs font-semibold text-[#5b605b] font-mono">
              Total Articles: <strong>{totalItems}</strong>
            </span>

            <form action="/blog" method="GET" className="w-full sm:w-80 relative">
              <input
                type="text"
                name="search"
                defaultValue={search || ''}
                placeholder="Search blog articles..."
                className="w-full bg-white border border-[#c9c7bd] rounded-md pl-9 pr-3 py-2 text-xs text-[#1f2220] placeholder-[#5b605b] focus:outline-none focus:border-[#E4B241]"
              />
              <Search className="w-3.5 h-3.5 text-[#5b605b] absolute left-3 top-3" />
            </form>
          </div>

          {/* Article List */}
          {paginatedBlogs.length > 0 ? (
            <div className="divide-y divide-[#e4e2da]">
              {paginatedBlogs.map((blog) => (
                <article key={blog.id} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center max-w-[900px]">
                  {blog.image_url && (
                    <div className="md:col-span-4">
                      <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#f6f4ee] border border-[#e4e2da]">
                        <Image
                          src={blog.image_url}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 30vw"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                  <div className={`${blog.image_url ? 'md:col-span-8' : 'md:col-span-12'} space-y-2`}>
                    <span className="text-xs text-[#5b605b] font-mono">
                      {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h2 className="text-2xl font-extrabold font-serif text-[#1f2220]">
                      <Link href={`/blog/${blog.slug}`} className="hover:underline">
                        {blog.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-[#5b605b] leading-relaxed line-clamp-3">{blog.excerpt}</p>
                    <div className="pt-2">
                      <Link href={`/blog/${blog.slug}`} className="text-xs font-bold text-[#9a6f0c] hover:underline">
                        Read guide →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#5b605b] text-sm">
              No blog posts found matching your search.
            </div>
          )}

          {/* Heavy-Duty Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            baseUrl="/blog"
            search={search}
          />
        </div>
      </section>
    </div>
  );
}
