'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  Camera
} from 'lucide-react';

interface ProductGalleryProps {
  productName: string;
  category: string;
  wattageRange?: string;
  images: string[];
  mainImage: string;
  lifestyleImage?: string;
}

export default function ProductGallery({
  productName,
  category,
  wattageRange,
  images,
  mainImage,
  lifestyleImage
}: ProductGalleryProps) {
  // Ensure we have a valid list of images
  const validImages = images && images.length > 0 ? images.filter(Boolean) : [mainImage];
  const initialIndex = validImages.indexOf(mainImage) >= 0 ? validImages.indexOf(mainImage) : 0;

  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxView, setLightboxView] = useState<'gallery' | 'lifestyle'>('gallery');

  const currentImage = validImages[selectedIndex] || validImages[0] || mainImage;
  const isCurrentMain = currentImage === mainImage || selectedIndex === 0;

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  }, [validImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (lightboxView === 'gallery') {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxView, handlePrev, handleNext]);

  return (
    <div className="space-y-6">
      {/* 1. Main Visual Card (Product Fixture) */}
      <div className="space-y-3">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#fbf9f4] border border-[#e5e3db] shadow-sm flex items-center justify-center p-6 group">
          <Image
            src={currentImage}
            alt={`${productName} view ${selectedIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
            onClick={() => {
              setLightboxView('gallery');
              setLightboxOpen(true);
            }}
            unoptimized
          />

          {/* Badges Overlay - Top Left */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
            <span className="bg-[#1f2220] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {category}
            </span>
            {wattageRange && (
              <span className="bg-[#E4B241] text-[#1f2220] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {wattageRange}
              </span>
            )}
            {isCurrentMain && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Main Product Photo
              </span>
            )}
          </div>

          {/* Badges Overlay - Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              IP67 Certified
            </span>
            <button
              type="button"
              onClick={() => {
                setLightboxView('gallery');
                setLightboxOpen(true);
              }}
              className="bg-white/90 hover:bg-white text-[#1f2220] p-1.5 rounded-md shadow-xs border border-[#e4e2da] cursor-pointer transition-colors"
              title="Expand photo"
              aria-label="Expand photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Left/Right Arrows if multiple images */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1f2220] p-2 rounded-full shadow-md border border-[#e5e3db] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#1f2220] p-2 rounded-full shadow-md border border-[#e5e3db] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Bottom Image Counter Pill */}
              <div className="absolute bottom-3 right-3 bg-[#1f2220]/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                <Camera className="w-3 h-3 text-[#E4B241]" />
                <span>{selectedIndex + 1} / {validImages.length}</span>
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Selector Strip (if more than 1 image) */}
        {validImages.length > 1 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#7d827d] px-1 font-medium">
              <span>Product Photos ({validImages.length} views)</span>
              <span className="text-[#9a6f0c] font-semibold">Click to inspect</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
              {validImages.map((imgUrl, idx) => {
                const isSelected = idx === selectedIndex;
                const isMain = imgUrl === mainImage || idx === 0;

                return (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#fbf9f4] cursor-pointer group/thumb ${
                      isSelected
                        ? 'border-[#E4B241] ring-2 ring-[#E4B241]/40 shadow-sm'
                        : 'border-[#e5e3db] hover:border-[#c9c7bd]'
                    }`}
                    aria-label={`Select product photo ${idx + 1}`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                      unoptimized
                    />
                    {isMain && (
                      <span className="absolute bottom-0.5 left-0.5 right-0.5 bg-[#1f2220]/90 text-[#E4B241] text-[9px] font-bold py-0.5 text-center rounded-sm">
                        MAIN
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Dedicated Product On Site (Real-World Installation) Showcase */}
      {lifestyleImage && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-[#5b605b] font-medium px-1">
            <span className="flex items-center gap-1 text-[#1f2220] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Actual On-Site Kerala Installation Photo
            </span>
            <span className="text-xs text-[#7d827d]">5-6m Galvanized Pole</span>
          </div>

          <div
            className="relative aspect-[16/8] rounded-xl overflow-hidden border border-[#e5e3db] shadow-xs group cursor-zoom-in bg-zinc-900"
            onClick={() => {
              setLightboxView('lifestyle');
              setLightboxOpen(true);
            }}
          >
            <Image
              src={lifestyleImage}
              alt={`${productName} actual site installation view`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent flex items-end p-3.5">
              <div className="flex items-center justify-between w-full">
                <p className="text-xs text-white/95 font-medium">
                  Installed with dusk-to-dawn intelligent solar controller & LiFePO4 battery enclosure.
                </p>
                <span className="bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-1 rounded ml-2 shrink-0">
                  Enlarge
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Header Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white py-2">
            <div>
              <h4 className="text-sm sm:text-base font-bold font-serif">{productName}</h4>
              <p className="text-xs text-neutral-400">
                {lightboxView === 'lifestyle'
                  ? 'Kerala On-Site Field Installation'
                  : `Product Fixture Photo ${selectedIndex + 1} of ${validImages.length}`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
              aria-label="Close photo view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo Area */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4">
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={lightboxView === 'lifestyle' ? (lifestyleImage || currentImage) : currentImage}
                alt={productName}
                fill
                sizes="100vw"
                className="object-contain"
                unoptimized
              />
            </div>

            {/* Navigation Arrows for Lightbox */}
            {lightboxView === 'gallery' && validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 cursor-pointer transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip for Lightbox */}
          {lightboxView === 'gallery' && validImages.length > 1 && (
            <div className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto py-2">
              {validImages.map((img, i) => (
                <button
                  key={`lb-${img}-${i}`}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer shrink-0 transition-all ${
                    i === selectedIndex ? 'border-[#E4B241] scale-105' : 'border-neutral-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="60px" className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
