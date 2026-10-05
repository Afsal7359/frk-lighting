import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProducts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Products',
  description: 'All-in-one, split-type and flood solar lights from FRK Lighting.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-0 pb-20">
      {/* Sub Banner */}
      <section className="bg-[#f6f4ee] border-b border-[#e4e2da] py-14">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#1f2220]">Products</h1>
          <p className="text-base text-[#5b605b] max-w-2xl">
            Solar street lights, flood lights and pathway lights. Final wattage, pole height and battery type are confirmed in your quotation.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-16">
          {products.map((prod, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={prod.id}
                id={prod.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                <div className={`lg:col-span-5 ${isEven ? '' : 'lg:order-2'}`}>
                  <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#f6f4ee] border border-[#e4e2da]">
                    <Image
                      src={prod.image_url || '/images/all-in-one.jpg'}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                <div className={`lg:col-span-7 space-y-4 ${isEven ? '' : 'lg:order-1'}`}>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#1f2220]">
                    {prod.name}
                  </h2>
                  <p className="text-[#5b605b] text-base leading-relaxed">{prod.description}</p>

                  <ul className="space-y-2 text-sm text-[#5b605b] pl-5 list-disc">
                    <li><b className="text-[#1f2220] font-serif">Best for:</b> {prod.best_for}</li>
                    <li><b className="text-[#1f2220] font-serif">Why choose it:</b> {prod.why_choose}</li>
                    <li><b className="text-[#1f2220] font-serif">Keep in mind:</b> {prod.keep_in_mind}</li>
                  </ul>

                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-5 py-2.5 rounded-md text-sm inline-block"
                    >
                      View Specs
                    </Link>
                    <Link
                      href="/contact"
                      className="bg-white hover:bg-[#f6f4ee] text-[#1f2220] border-2 border-[#1f2220] font-bold px-5 py-2.5 rounded-md text-sm inline-block"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-[#f6f4ee] border-t border-[#e4e2da]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#1f2220]">
            Which type should I choose?
          </h2>

          <div className="overflow-x-auto rounded-lg border border-[#e4e2da] bg-white">
            <table className="w-full text-left text-sm text-[#1f2220]">
              <thead className="bg-[#f6f4ee] font-serif font-bold border-b border-[#e4e2da]">
                <tr>
                  <th className="p-3"></th>
                  <th className="p-3">All-in-one</th>
                  <th className="p-3">Split-type</th>
                  <th className="p-3">Flood light</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e2da]">
                <tr>
                  <td className="p-3 font-semibold">Light a road</td>
                  <td className="p-3">Small and medium roads</td>
                  <td className="p-3 font-bold text-[#9a6f0c]">Best choice for main roads</td>
                  <td className="p-3 text-slate-500">Not recommended</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Light an area</td>
                  <td className="p-3">Small areas</td>
                  <td className="p-3">With several poles</td>
                  <td className="p-3 font-bold text-[#9a6f0c]">Best choice</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Installation</td>
                  <td className="p-3 font-bold text-[#9a6f0c]">Fastest</td>
                  <td className="p-3">Moderate</td>
                  <td className="p-3">Fast on poles or walls</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Extra capacity</td>
                  <td className="p-3">Limited</td>
                  <td className="p-3 font-bold text-[#9a6f0c]">Larger panel and battery possible</td>
                  <td className="p-3">Depends on model</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Battery replacement</td>
                  <td className="p-3">Replace the body or pack</td>
                  <td className="p-3 font-bold text-[#9a6f0c]">Replace the battery alone</td>
                  <td className="p-3">Depends on model</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#5b605b]">Poles, brackets, foundations and installation are available with any product.</p>
        </div>
      </section>
    </div>
  );
}
