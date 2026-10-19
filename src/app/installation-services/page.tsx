'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  CheckCircle2,
  Wrench,
  FileCheck,
  CalendarCheck,
  ShieldAlert,
  ShieldCheck,
  Headphones,
  ArrowRight,
  MessageCircle,
  Sun,
  Compass,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import QuoteModal from '@/components/QuoteModal';

export default function InstallationServicesPage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const topics = [
    {
      num: '01',
      title: 'Site Assessment',
      icon: MapPin,
      badge: 'Step 1 • On-Site Survey',
      image: '/images/frk14.jpg',
      summary: 'Our team visits your location to evaluate sunlight exposure, mounting options, and coverage requirements.',
      points: [
        'Sunlight hours & shadow analysis (trees, nearby buildings, palms)',
        'Road/area dimensions, road width, and optimal pole spacing calculation',
        'Ground & soil evaluation for concrete foundation depth & anchor bolts'
      ]
    },
    {
      num: '02',
      title: 'Product Recommendation',
      icon: Compass,
      badge: 'Step 2 • Engineering Sizing',
      image: '/images/frk16.jpg',
      summary: 'Selecting the exact fixture type, lumen output, panel wattage, and battery autonomy tailored to your site.',
      points: [
        'Choice between integrated All-in-One vs high-capacity Split-Type systems',
        'LiFePO4 battery sizing to ensure 2+ days uninterrupted monsoon autonomy',
        'Optic beam angle (120° wide road distribution) and lux level calculations'
      ]
    },
    {
      num: '03',
      title: 'Quotation Preparation',
      icon: FileCheck,
      badge: 'Step 3 • Transparent Pricing',
      image: '/images/frk8.jpg',
      summary: 'Comprehensive, all-inclusive proposal with zero hidden charges or surprise costs.',
      points: [
        'Clear itemized breakdown: Luminaires, solar panels, batteries, and controllers',
        'Galvanized iron (GI) poles (5m-6m), mounting brackets, and anchor kits',
        'Civil foundation works, logistics delivery across Kerala, and labor included'
      ]
    },
    {
      num: '04',
      title: 'Installation Planning',
      icon: CalendarCheck,
      badge: 'Step 4 • Project Logistics',
      image: '/images/frk7.jpg',
      summary: 'Civil foundation curing, delivery schedules, and coordination with site authorities.',
      points: [
        'Excavation and civil foundation casting with high-grade concrete mix',
        '5 to 7-day curing period to withstand high tropical wind loads',
        'Pre-assembly testing of solar panels, controllers, and LED modules'
      ]
    },
    {
      num: '05',
      title: 'Professional Installation',
      icon: Wrench,
      badge: 'Step 5 • Precision Erection',
      image: '/images/frk15.jpg',
      summary: 'Experienced technician team erects poles, mounts luminaires, and calibrates solar orientation.',
      points: [
        'True-south solar panel orientation for maximum daily photovoltaic yield',
        'Secure pole flange mounting with high-tensile galvanized anchor bolts',
        'Dusk-to-dawn sensor calibration and intelligent remote control testing'
      ]
    },
    {
      num: '06',
      title: 'After-Sales Support',
      icon: Headphones,
      badge: 'Step 6 • Long-Term Care',
      image: '/images/frk12.jpg',
      summary: 'Dedicated Kerala-based technical service, warranty backing, and annual maintenance advice.',
      points: [
        'Comprehensive warranty on luminaires, LiFePO4 batteries, and solar panels',
        'Direct phone and WhatsApp technical assistance team located in Kerala',
        'Periodic preventative maintenance advice and prompt replacement support'
      ]
    }
  ];

  const processSteps = [
    { step: 1, name: 'Enquiry', desc: 'Reach out via phone, WhatsApp, or web form with basic location details.' },
    { step: 2, name: 'Site Assessment', desc: 'Our technicians survey sun paths, shadows, soil, and pole positions.' },
    { step: 3, name: 'Quotation', desc: 'Receive a customized, all-inclusive proposal with technical sizing.' },
    { step: 4, name: 'Confirmation', desc: 'Approve proposal, confirm pole specifications, and schedule dates.' },
    { step: 5, name: 'Installation', desc: 'Civil foundation, pole erection, mounting, and commissioning.' },
    { step: 6, name: 'Support', desc: 'Ongoing technical service, warranty care, and long-term reliability.' }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#fcfbf7] border-b border-[#e5e3db] py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E4B241]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E4B241]/15 text-[#9a6f0c] text-xs font-semibold uppercase tracking-wider border border-[#E4B241]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#9a6f0c]" />
            Installation Services
          </div>

          <h1 className="text-3xl sm:text-6xl font-extrabold font-serif text-[#1f2220] tracking-tight leading-tight max-w-3xl">
            Installed Right, the First Time
          </h1>

          <p className="text-base sm:text-xl text-[#5b605b] max-w-2xl leading-relaxed">
            FRK provides complete solar lighting installation across Kerala — from the first site visit to long term support.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-7 py-3.5 rounded-lg text-sm sm:text-base inline-flex items-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <span>Book a Free Site Assessment</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
            <Link
              href="https://wa.me/917025888461?text=Hi%20FRK%20Lighting,%20I%20am%20interested%20in%20solar%20lighting%20installation%20services%20for%20my%20site."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-[#f6f4ee] border border-[#1f2220] text-[#1f2220] font-bold px-6 py-3.5 rounded-lg text-sm inline-flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Inquiry</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. THE 6 DETAILED TOPICS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#9a6f0c] uppercase tracking-wider font-serif">
              Comprehensive Turnkey Execution
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">
              Our Complete Installation Services
            </h2>
            <p className="text-sm sm:text-base text-[#5b605b]">
              Every solar installation in Kerala requires proper civil engineering, shade calculations, and waterproof electrical standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topics.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="bg-[#fcfbf7] rounded-2xl border border-[#e5e3db] p-6 flex flex-col justify-between space-y-6 hover:border-[#E4B241] hover:shadow-md transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Image Preview */}
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white border border-[#e5e3db]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <div className="absolute top-3 left-3 bg-[#1f2220]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                        {item.num}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#9a6f0c] uppercase tracking-wider block">
                        {item.badge}
                      </span>
                      <h3 className="text-xl font-bold font-serif text-[#1f2220] flex items-center gap-2">
                        <Icon className="w-5 h-5 text-[#9a6f0c] shrink-0" />
                        <span>{item.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5b605b] leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-[#5b605b] pt-2 border-t border-[#e8e6df]">
                      {item.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="text-xs font-bold text-[#9a6f0c] hover:text-[#1f2220] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Inquire about {item.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. OUR PROCESS TIMELINE (From Page 2 Sketch) */}
      <section className="py-20 bg-[#fbf9f4] border-t border-[#e5e3db]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#9a6f0c] uppercase tracking-wider font-serif">
              Structured 6-Stage Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#1f2220]">
              Our Process
            </h2>
            <p className="text-sm sm:text-base text-[#5b605b]">
              From your initial enquiry to long-term post-installation care, here is how we work with you.
            </p>
          </div>

          {/* Process Steps Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {processSteps.map((p) => (
              <div
                key={p.step}
                className="bg-white rounded-xl p-5 border border-[#e5e3db] shadow-xs flex flex-col justify-between space-y-3 relative hover:border-[#E4B241] transition-colors"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#E4B241]/20 text-[#9a6f0c] font-extrabold flex items-center justify-center text-sm font-serif">
                    {p.step}
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#1f2220]">
                    {p.name}
                  </h4>
                  <p className="text-xs text-[#5b605b] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-semibold text-[#9a6f0c]">
                  Stage 0{p.step}
                </div>
              </div>
            ))}
          </div>

          {/* District Coverage Callout Box (Exact match of handwritten note) */}
          <div className="bg-[#1f2220] rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center md:text-left max-w-xl">
              <span className="text-xs font-bold tracking-widest text-[#E4B241] uppercase">
                DISTRICT COVERAGE
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                We currently serve sites across Kerala.
              </h3>
              <p className="text-sm sm:text-base text-[#d3d7d3]">
                Contact us to confirm coverage in your district. We handle projects in Kozhikode, Malappuram, Ernakulam, Thrissur, Kannur, Wayanad, Kottayam, and across all 14 districts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="https://wa.me/917025888461?text=Hello%20FRK%20Lighting,%20I%20would%20like%20to%20confirm%20solar%20installation%20coverage%20for%20my%20district."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-7 py-3.5 rounded-lg text-sm sm:text-base transition-all inline-flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#1f2220]" />
                <span>START YOUR ENQUIRY</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </div>
  );
}
