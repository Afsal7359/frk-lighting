'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Lightbulb,
  ArrowRight,
  Star,
  Quote,
  Sun,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { InstallationStory, CustomerTestimonial } from '@/lib/types';
import { getInstallationStories, getTestimonials } from '@/lib/data';
import QuoteModal from '@/components/QuoteModal';

export default function CustomerStoriesPage() {
  const [stories, setStories] = useState<InstallationStory[]>([]);
  const [testimonials, setTestimonials] = useState<CustomerTestimonial[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      const [storiesData, testimonialsData] = await Promise.all([
        getInstallationStories(),
        getTestimonials()
      ]);
      setStories(storiesData);
      setTestimonials(testimonialsData);
    }
    loadData();
  }, []);

  const categories = [
    'All',
    'Solar Street Lights',
    'Solar Flood Lights',
    'Commercial',
    'Residential'
  ];

  const filteredStories = activeCategory === 'All'
    ? stories
    : stories.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  const handlePrevTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, testimonials.length - 1)));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonialIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[520px] sm:min-h-[580px] flex items-center bg-[#111311] overflow-hidden">
        {/* Background Night Landscape */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/frk1.webp"
            alt="FRK Lighting Customer Stories Night Installations"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-60"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#E4B241] uppercase font-sans">
              CUSTOMER STORIES
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-serif text-white tracking-tight leading-[1.1]">
              Real Installations.<br />
              <span className="text-[#E4B241]">Real Experiences.</span>
            </h1>
            <p className="text-base sm:text-lg text-[#d3d7d3] leading-relaxed max-w-xl pt-1">
              Discover how FRK Lighting Solution is helping homes, businesses, and communities with reliable solar lighting installations across Kerala.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-7 py-3.5 rounded-lg text-sm sm:text-base inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Request a Quotation</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INSTALLATION SUCCESS STORIES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 space-y-10">
          {/* Header & Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">
                Installation Success Stories
              </h2>
              <p className="text-sm sm:text-base text-[#5b605b]">
                A few of our recent solar lighting installations.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#E4B241] text-[#1f2220] shadow-xs'
                        : 'bg-white text-[#5b605b] border border-[#e4e2da] hover:border-[#1f2220] hover:text-[#1f2220]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div
                key={story.id}
                className="bg-white rounded-xl border border-[#e4e2da] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-[#f6f4ee] overflow-hidden">
                    <Image
                      src={story.image_url}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold font-serif text-[#1f2220]">
                      {story.title}
                    </h3>
                    <div className="space-y-1 text-xs text-[#5b605b]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#9a6f0c] shrink-0" />
                        <span>{story.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-[#9a6f0c] shrink-0" />
                        <span>{story.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex justify-end">
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    aria-label={`Inquire about ${story.title}`}
                    className="w-9 h-9 rounded-full border border-[#e4e2da] hover:border-[#1f2220] hover:bg-[#1f2220] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-[#1f2220]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT OUR CUSTOMERS SAY (DARK SECTION) */}
      <section className="py-20 bg-[#111311] text-white border-y border-[#242624]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 space-y-12">
          {/* Header with Navigation Controls */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">
                What Our Customers Say
              </h2>
              <p className="text-sm sm:text-base text-[#8f948f]">
                Feedback from customers who have experienced FRK installations.
              </p>
            </div>

            {/* Slider arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTestimonial}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border border-[#343834] hover:border-[#E4B241] flex items-center justify-center text-[#d3d7d3] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextTestimonial}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border border-[#343834] hover:border-[#E4B241] flex items-center justify-center text-[#d3d7d3] hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-[#191c19] border border-[#2b302b] rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-[#E4B241]/50 transition-colors"
              >
                <div className="space-y-4">
                  {/* Amber Quote Icon */}
                  <Quote className="w-8 h-8 text-[#E4B241] fill-[#E4B241] rotate-180 opacity-90" />
                  <p className="text-sm text-[#d3d7d3] leading-relaxed">
                    &ldquo;{test.comment}&rdquo;
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#262a26]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#444a44]">
                      <Image
                        src={test.avatar_url || '/images/avatars/user1.svg'}
                        alt={test.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif">
                        {test.name}
                      </h4>
                      <p className="text-xs text-[#8f948f]">
                        {test.location}
                      </p>
                    </div>
                  </div>

                  {/* 5 Gold Stars */}
                  <div className="flex items-center gap-1 text-[#E4B241]">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E4B241]" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LET'S LIGHT UP YOUR SPACE (BOTTOM HERO CTA) */}
      <section className="relative py-20 bg-[#0d0f0d] text-white overflow-hidden">
        {/* Background Image with Night Warmth */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/frk1.webp"
            alt="Solar street lights lighting up the space"
            fill
            sizes="100vw"
            className="object-cover object-bottom opacity-40 brightness-75"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
        </div>

        <div className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold tracking-widest text-[#E4B241] uppercase font-sans">
                YOUR PROJECT COULD BE NEXT
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
                Let&apos;s Light Up<br />
                Your Space
              </h2>
              <p className="text-sm sm:text-base text-[#d3d7d3] max-w-lg leading-relaxed">
                Contact us for a site assessment and a customised quotation for your solar lighting project.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-6 py-3.5 rounded-lg text-sm inline-flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Request a Quotation</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>

                <Link
                  href="https://wa.me/917025888461?text=Hello%20FRK%20Lighting,%20I%20would%20like%20to%20discuss%20a%20solar%20lighting%20project%20for%20my%20site."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/60 hover:bg-black/90 border border-white/20 hover:border-white text-white font-semibold px-6 py-3.5 rounded-lg text-sm inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </Link>
              </div>
            </div>

            {/* Right Column: 3 Pillar Highlights */}
            <div className="lg:col-span-5 flex flex-wrap lg:flex-nowrap items-center justify-around gap-6 pt-4 lg:pt-0">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#E4B241]">
                  <Sun className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-white max-w-[100px]">
                  Reliable Solar Lighting
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#E4B241]">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-white max-w-[100px]">
                  Professional Installation
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#E4B241]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-white max-w-[100px]">
                  Long-Term Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </div>
  );
}
