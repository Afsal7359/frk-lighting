import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getApplications } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Lighting Solutions for Every Space | FRK Lighting Kerala',
  description: 'From residential communities to commercial properties and public roads, discover solar lighting solutions designed for different environments across Kerala.',
};

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="space-y-0 pb-20">
      {/* Sub Banner */}
      <section className="bg-[#f6f4ee] border-b border-[#e4e2da] py-14">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#1f2220] tracking-tight leading-tight">
            Lighting Solutions for Every Space.
          </h1>
          <p className="text-base sm:text-lg text-[#5b605b] max-w-3xl leading-relaxed">
            From residential communities to commercial properties and public roads, Discover solar Lighting Solutions designed for different environments
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white border border-[#e4e2da] rounded-lg overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/9] bg-[#f6f4ee]">
                    <Image
                      src={app.image_url || '/images/road.jpg'}
                      alt={app.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-5 space-y-1.5">
                    <h2 className="text-lg font-bold font-serif text-[#1f2220]">{app.title}</h2>
                    <p className="text-xs text-[#5b605b] leading-relaxed">{app.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link href="/contact" className="text-xs font-bold text-[#9a6f0c] hover:underline">
                    Request Quote →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
