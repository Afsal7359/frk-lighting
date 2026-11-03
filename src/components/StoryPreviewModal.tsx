'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  Tag,
  ArrowRight
} from 'lucide-react';
import { InstallationStory, SiteSettings } from '@/lib/types';

interface StoryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: InstallationStory[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onOpenQuote?: (story: InstallationStory) => void;
  settings?: SiteSettings;
}

export default function StoryPreviewModal({
  isOpen,
  onClose,
  stories,
  currentIndex,
  onNavigate,
  onOpenQuote,
  settings
}: StoryPreviewModalProps) {
  const currentStory = stories[currentIndex] || stories[0];

  const handlePrev = useCallback(() => {
    if (stories.length <= 1) return;
    onNavigate(currentIndex > 0 ? currentIndex - 1 : stories.length - 1);
  }, [currentIndex, stories.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (stories.length <= 1) return;
    onNavigate(currentIndex < stories.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, stories.length, onNavigate]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentStory) return null;

  const whatsappPhone = (settings?.whatsapp || settings?.phone || '917025888461').replace(/\D/g, '');
  const encodedWhatsappMsg = encodeURIComponent(
    `Hello FRK Lighting, I am interested in the ${currentStory.title} installation in ${currentStory.location}. Could you share more details and a quotation for a similar setup?`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${currentStory.title} preview`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#141614] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#101210] text-white">
          <div className="space-y-1 pr-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                Verified On-Site Installation
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] text-[#E4B241] font-semibold bg-white/5 px-2.5 py-0.5 rounded border border-white/10">
                <Tag className="w-3 h-3 shrink-0" />
                {currentStory.category}
              </span>

              <span className="text-[11px] text-neutral-400 hidden md:inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E4B241] shrink-0" />
                {currentStory.location}
              </span>
            </div>

            <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
              {currentStory.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {stories.length > 1 && (
              <span className="text-xs text-neutral-400 font-mono bg-white/10 px-2.5 py-1 rounded-full hidden sm:inline-block">
                {currentIndex + 1} / {stories.length}
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Center: Full Height Portrait-Friendly Image Viewport */}
        <div className="relative w-full flex-1 min-h-[360px] sm:min-h-[500px] max-h-[68vh] sm:max-h-[74vh] bg-[#0a0c0a] flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none">
          <img
            src={currentStory.image_url}
            alt={`${currentStory.title} in ${currentStory.location} - Real Kerala Solar Installation`}
            className="w-full h-full max-h-[66vh] sm:max-h-[72vh] object-contain rounded-lg drop-shadow-2xl"
          />

          {/* Left Arrow Button */}
          {stories.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#E4B241] text-white hover:text-black border border-white/20 hover:border-[#E4B241] cursor-pointer transition-all shadow-xl backdrop-blur-xs"
              aria-label="Previous customer story photo"
              title="Previous photo (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Right Arrow Button */}
          {stories.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#E4B241] text-white hover:text-black border border-white/20 hover:border-[#E4B241] cursor-pointer transition-all shadow-xl backdrop-blur-xs"
              aria-label="Next customer story photo"
              title="Next photo (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Floating Portrait Badge indicator */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-md border border-white/10 hidden sm:flex items-center gap-1.5 pointer-events-none">
            <Maximize2 className="w-3 h-3 text-[#E4B241]" />
            <span>Full Portrait View • Uncropped Installation Photo</span>
          </div>
        </div>

        {/* Modal Thumbnail Strip (if multiple stories) */}
        {stories.length > 1 && (
          <div className="bg-[#101210] border-t border-white/10 px-4 py-2 flex items-center justify-center gap-2 overflow-x-auto">
            {stories.map((st, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={st.id || idx}
                  type="button"
                  onClick={() => onNavigate(idx)}
                  className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-md overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                    isSelected
                      ? 'border-[#E4B241] ring-2 ring-[#E4B241]/40 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                  title={st.title}
                  aria-label={`Jump to photo ${idx + 1}: ${st.title}`}
                >
                  <img
                    src={st.image_url}
                    alt={st.title}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Footer with Story Details & Action CTAs */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 bg-[#121412] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-neutral-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#E4B241] shrink-0" />
              <span>{currentStory.location}</span>
              {currentStory.date && <span className="text-neutral-500">• {currentStory.date}</span>}
            </div>
            {currentStory.description && (
              <p className="text-neutral-400 text-[11px] sm:text-xs leading-relaxed line-clamp-2">
                {currentStory.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            {onOpenQuote && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuote(currentStory);
                }}
                className="bg-[#E4B241] hover:bg-[#efc25b] text-[#1f2220] font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <span>Request Similar Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <Link
              href={`https://wa.me/${whatsappPhone}?text=${encodedWhatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-white/15"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="bg-transparent hover:bg-white/10 text-neutral-300 hover:text-white font-medium px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
