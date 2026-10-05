'use client';

import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello FRK Lighting, I would like a quote for solar street lights.'
  )}`;

  return (
    <>
      {/* Mid CTA Banner */}
      <section className="bg-[#E4B241] py-14 border-t border-[#d8c58f]">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-[#1f2220] max-w-xl">
            Tell us about your site. We will size the lights.
          </h2>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#242624] hover:bg-[#111211] text-white font-bold text-base px-7 py-3.5 rounded-md transition-all shadow-md whitespace-nowrap"
          >
            Message us on WhatsApp
          </a>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-[#242624] text-[#bdbbb0] text-sm pt-14 pb-8">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-5 space-y-3">
              <h3 className="text-white text-base font-bold font-serif m-0">FRK Lighting Solutions</h3>
              <p className="text-[#bdbbb0] leading-relaxed max-w-md">
                {settings.footer_text}
              </p>
            </div>

            {/* Column 2: Pages */}
            <div className="md:col-span-3 space-y-2">
              <h3 className="text-white text-base font-bold font-serif mb-3">Pages</h3>
              <ul className="space-y-1.5">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'Products', href: '/products' },
                  { label: 'Applications', href: '/applications' },
                  { label: 'About', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Contact', href: '/contact' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors text-white/90">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="md:col-span-4 space-y-2">
              <h3 className="text-white text-base font-bold font-serif mb-3">Contact</h3>
              <p className="m-0">
                <a href={`mailto:${settings.email}`} className="text-white hover:underline">
                  {settings.email}
                </a>
              </p>
              <p className="m-0">
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-white hover:underline">
                  {settings.phone}
                </a>
              </p>
              <p className="m-0 text-slate-300">WhatsApp: same number</p>
              <p className="m-0 pt-1">
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                >
                  Instagram {settings.instagram_handle}
                </a>
              </p>
            </div>
          </div>

          {/* Copyright & Admin Link */}
          <div className="pt-6 border-t border-[#3d403c] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#9e9c93]">
            <span>© {new Date().getFullYear()} FRK Lighting Solutions. All rights reserved.</span>
            <Link href="/admin/login" className="hover:text-amber-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
