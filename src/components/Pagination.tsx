'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  baseUrl: string;
  queryParamName?: string;
  search?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  baseUrl,
  queryParamName = 'page',
  search
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set(queryParamName, page.toString());
    if (search) params.set('search', search);

    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  // Calculate start & end item index
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with smart ellipsis (...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // number of pages to show before and after current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - delta - 1 && i > 1) ||
        (i === currentPage + delta + 1 && i < totalPages)
      ) {
        pages.push('...');
      }
    }

    // Filter consecutive duplicate ellipsis
    return pages.filter((item, index, arr) => item !== '...' || arr[index - 1] !== '...');
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-4 my-10 border-t border-[#e4e2da] pt-6">
      {/* Items count indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#5b605b] gap-2 font-mono">
        <span>
          Showing <strong>{startItem}–{endItem}</strong> of <strong>{totalItems}</strong> articles
        </span>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center justify-center gap-1.5 flex-wrap" aria-label="Pagination Navigation">
        {/* First Page */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(1)}
            className="flex items-center justify-center px-2.5 h-9 rounded-md bg-[#f6f4ee] border border-[#e4e2da] text-[#1f2220] hover:bg-[#e4e2da] transition-colors text-xs font-semibold"
            aria-label="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center justify-center px-2.5 h-9 rounded-md bg-[#f6f4ee]/50 border border-[#e4e2da]/50 text-slate-400 cursor-not-allowed text-xs">
            <ChevronsLeft className="w-4 h-4" />
          </span>
        )}

        {/* Previous Page */}
        {currentPage > 1 ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="flex items-center justify-center px-3 h-9 rounded-md bg-[#f6f4ee] border border-[#e4e2da] text-[#1f2220] hover:bg-[#e4e2da] transition-colors text-xs font-semibold gap-1"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Link>
        ) : (
          <span className="flex items-center justify-center px-3 h-9 rounded-md bg-[#f6f4ee]/50 border border-[#e4e2da]/50 text-slate-400 cursor-not-allowed text-xs gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </span>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="w-8 h-9 flex items-center justify-center text-xs text-[#5b605b] font-mono">
                  ...
                </span>
              );
            }
            const isActive = p === currentPage;
            return (
              <Link
                key={`page-${p}`}
                href={buildUrl(p as number)}
                className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#E4B241] text-[#1f2220] shadow-xs'
                    : 'bg-[#f6f4ee] border border-[#e4e2da] text-[#1f2220] hover:bg-[#e4e2da]'
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Next Page */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="flex items-center justify-center px-3 h-9 rounded-md bg-[#f6f4ee] border border-[#e4e2da] text-[#1f2220] hover:bg-[#e4e2da] transition-colors text-xs font-semibold gap-1"
            aria-label="Next Page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center justify-center px-3 h-9 rounded-md bg-[#f6f4ee]/50 border border-[#e4e2da]/50 text-slate-400 cursor-not-allowed text-xs gap-1">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}

        {/* Last Page */}
        {currentPage < totalPages ? (
          <Link
            href={buildUrl(totalPages)}
            className="flex items-center justify-center px-2.5 h-9 rounded-md bg-[#f6f4ee] border border-[#e4e2da] text-[#1f2220] hover:bg-[#e4e2da] transition-colors text-xs font-semibold"
            aria-label="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="flex items-center justify-center px-2.5 h-9 rounded-md bg-[#f6f4ee]/50 border border-[#e4e2da]/50 text-slate-400 cursor-not-allowed text-xs">
            <ChevronsRight className="w-4 h-4" />
          </span>
        )}
      </nav>
    </div>
  );
}
