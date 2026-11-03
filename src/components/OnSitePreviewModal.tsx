'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface OnSitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  productName?: string;
  subtitle?: string;
}

export default function OnSitePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  productName = 'Solar Street Light',
  subtitle = 'Real Kerala On-Site Field Installation'
}: OnSitePreviewModalProps) {
  // Close on Escape key press and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#191b19] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#121412]/90 text-white">
          <div className="space-y-0.5 pr-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified On-Site Photo
              </span>
              <span className="text-[11px] text-[#E4B241] font-semibold font-mono hidden sm:inline-block">
                Kerala Installation View
              </span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate max-w-lg">
              {productName}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Image Area */}
        <div className="relative w-full flex-1 min-h-[320px] sm:min-h-[480px] max-h-[76vh] bg-black/95 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <img
            src={imageUrl}
            alt={`${productName} real on-site installation preview`}
            className="w-full h-full max-h-[72vh] object-contain rounded-lg"
          />
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#121412]/95 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#E4B241] shrink-0" />
            <span>Installed on 5-6m Galvanized Pole with Dusk-to-Dawn Intelligent Solar Controller</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer border border-white/10"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
