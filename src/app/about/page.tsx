import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';

export const metadata: Metadata = {
  title: 'About us',
  description: 'FRK Lighting Solutions supplies solar street lighting in Kerala.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-0 pb-20">
      {/* Sub Banner */}
      <section className="bg-[#f6f4ee] border-b border-[#e4e2da] py-14">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-[#1f2220]">About FRK Lighting</h1>
          <p className="text-base text-[#5b605b] max-w-xl">
            A Kerala supplier of solar street lights, built on clear advice and honest sizing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">Who we are</h2>
              <p className="text-[#5b605b] text-base leading-relaxed">
                FRK Lighting Solutions supplies solar street lights, flood lights and pathway lights for businesses, residential projects and public spaces across Kerala.
              </p>
              <p className="text-[#5b605b] text-base leading-relaxed">
                Too many buyers get a spec sheet and no advice. We do it differently. We ask about the road, the shade and the weather, then recommend a light that fits. If a smaller system will do, we say so.
              </p>
              <p className="text-[#5b605b] text-base leading-relaxed">
                We handle the full job: choosing the right product, supplying poles and fittings, installing on site and supporting you afterwards.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#f6f4ee] border border-[#e4e2da]">
                <Image
                  src="/images/frk1.webp"
                  alt="FRK Lighting team on site"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-[#f6f4ee] border-y border-[#e4e2da]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 space-y-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#1f2220]">How we work</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Honest sizing", desc: "We size the panel and battery for the rainy season, not the sunniest week, so the lights do not fade by midnight." },
              { title: "Clear quotations", desc: "Lights, poles, foundations, transport and installation are listed line by line." },
              { title: "Local support", desc: "We are in Kerala. If a light has a problem, we can reach you and speak your language." },
              { title: "Complete service", desc: "Survey, supply, civil work, installation and after-sales from one team." }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white border border-[#e4e2da] rounded-lg p-5 space-y-2">
                <h3 className="text-base font-bold font-serif text-[#1f2220]">{pillar.title}</h3>
                <p className="text-xs text-[#5b605b] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens On A Project */}
      <section className="py-16 bg-white">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-[#f6f4ee] border border-[#e4e2da]">
                <Image
                  src="/images/frk5.jpg"
                  alt="Installation in progress"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-[#1f2220]">What happens on a project</h2>
              <div className="space-y-4 border-l-2 border-[#E4B241] pl-4">
                {[
                  { title: "Site details", desc: "Send photos, a sketch or a location and the number of lights." },
                  { title: "Recommendation and quote", desc: "We propose a system with a written quote." },
                  { title: "Supply and install", desc: "Foundations, poles, lights and testing on site." },
                  { title: "Handover and support", desc: "You get warranty terms and a number to call." }
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <h3 className="text-base font-bold font-serif text-[#1f2220]">{idx + 1}. {s.title}</h3>
                    <p className="text-xs text-[#5b605b]">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
