import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { getProducts } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-12 pb-24 max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-[#5b605b] hover:text-[#1f2220] text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </Link>

      <div className="bg-white border border-[#e4e2da] rounded-lg p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#f6f4ee] border border-[#e4e2da]">
              <Image
                src={product.image_url || '/images/all-in-one.jpg'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-bold font-serif text-[#9a6f0c] uppercase tracking-wider block">
              {product.category}
            </span>
            <h1 className="text-3xl font-extrabold font-serif text-[#1f2220]">
              {product.name}
            </h1>
            <p className="text-[#5b605b] text-base leading-relaxed">{product.description}</p>

            <div className="pt-2">
              <Link
                href="/contact"
                className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-6 py-3 rounded-md text-sm inline-block"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#e4e2da] space-y-4">
          <h2 className="text-xl font-bold font-serif text-[#1f2220]">Specifications & Details</h2>
          <ul className="space-y-2 text-sm text-[#5b605b] list-disc pl-5">
            <li><b className="text-[#1f2220]">Best suited for:</b> {product.best_for}</li>
            <li><b className="text-[#1f2220]">Wattage range:</b> {product.wattage_range || "Custom"}</li>
            <li><b className="text-[#1f2220]">Why choose it:</b> {product.why_choose}</li>
            <li><b className="text-[#1f2220]">Keep in mind:</b> {product.keep_in_mind}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
