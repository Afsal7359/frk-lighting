'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Mail, Phone } from 'lucide-react';
import { SiteSettings } from '@/lib/types';
import QuoteModal from './QuoteModal';

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/applications', label: 'Applications' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Dark Bar */}
      <div className="bg-[#242624] text-[#d8d6cc] text-sm py-2 px-4 font-sans border-b border-black/10">
        <div className="max-w-[1160px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Solar street lights, Kerala</span>
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">
              {settings.email}
            </a>
            <span>|</span>
            <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-amber-400 font-semibold transition-colors">
              {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#e4e2da] shadow-xs">
        <div className="max-w-[1160px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <div className="h-12 sm:h-14 w-48 sm:w-56 relative flex-shrink-0">
              <Image
                src="/images/frk-logo.png"
                alt="FRK Lighting Logo"
                fill
                sizes="220px"
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 ml-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-[#f6f4ee] text-[#1f2220] font-bold border-b-2 border-[#E4B241]'
                      : 'text-[#1f2220] hover:bg-[#f6f4ee]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="ml-3 bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold text-sm px-4.5 py-2 rounded-md transition-all shadow-xs cursor-pointer"
            >
              Get a quote
            </button>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1f2220] hover:bg-[#f6f4ee] rounded-md border border-[#e4e2da]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#e4e2da] px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-md text-sm font-medium ${
                    isActive ? 'bg-[#E4B241]/20 font-bold text-[#1f2220]' : 'text-[#1f2220] hover:bg-[#f6f4ee]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setQuoteModalOpen(true);
                }}
                className="w-full bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold py-2.5 rounded-md text-sm text-center"
              >
                Get a quote
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Quote Modal */}
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} settings={settings} />
    </>
  );
}
