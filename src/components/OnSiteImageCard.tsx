'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Maximize2 } from 'lucide-react';
import OnSitePreviewModal from './OnSitePreviewModal';

interface OnSiteImageCardProps {
  imageUrl: string;
  productName: string;
}

export default function OnSiteImageCard({ imageUrl, productName }: OnSiteImageCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
        className="relative aspect-[16/7] rounded-lg overflow-hidden border border-[#e8e6df] shadow-xs group cursor-pointer bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#E4B241]"
        title="Click to view large on-site installation photo"
      >
        <Image
          src={imageUrl}
          alt={`${productName} real installation view`}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-between p-2.5">
          <span className="text-[11px] text-white/95 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#E4B241]" />
            Real Installation View
          </span>

          <span className="bg-black/60 group-hover:bg-[#E4B241] group-hover:text-black text-white text-[10px] font-bold px-2 py-0.5 rounded transition-colors flex items-center gap-1 backdrop-blur-xs">
            <Maximize2 className="w-3 h-3" />
            <span>Click to Enlarge</span>
          </span>
        </div>
      </div>

      <OnSitePreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={imageUrl}
        productName={productName}
      />
    </>
  );
}
