'use client';

import React from 'react';
import { Search, Loader2 } from 'lucide-react';

export interface TableColumn<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  title?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function Table<T>({
  data,
  columns,
  showSearch = false,
  searchPlaceholder = '검색어 입력...',
  onSearch,
  isLoading = false,
  emptyMessage = '데이터가 없습니다.',
  title,
  currentPage,
  totalPages,
  onPageChange,
}: TableProps<T>) {
  const getDisplayPages = () => {
    const total = totalPages || 0;
    const current = currentPage || 0;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }

    const pages: (number | '...')[] = [];
    
    // Always show first
    pages.push(0);

    if (current > 3) {
      pages.push('...');
    }

    const start = Math.max(1, current - 1);
    const end = Math.min(total - 2, current + 1);

    // Dynamic range adjustment to ensure we always show enough buttons
    let rangeStart = start;
    let rangeEnd = end;
    if (current <= 3) rangeEnd = 4;
    if (current >= total - 4) rangeStart = total - 5;

    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i > 0 && i < total - 1) {
        pages.push(i);
      }
    }

    if (current < total - 4) {
      pages.push('...');
    }

    // Always show last
    if (total > 1) {
      pages.push(total - 1);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-ui-border overflow-hidden animate-in fade-in duration-500">
      {/* Header & Search */}
      {(title || showSearch) && (
        <div className="px-8 py-6 border-b border-ui-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-base">
          {title && <h2 className="font-bold text-gray-800 shrink-0">{title}</h2>}
          {showSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full bg-white border border-ui-border rounded-xl pl-11 pr-4 py-2 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 transition-all"
              />
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-400 font-bold uppercase tracking-widest bg-bg-base/50">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-8 py-4 border-b border-ui-border ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ui-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                    <p className="text-xs font-bold text-gray-400">데이터를 불러오고 있습니다...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20 text-center">
                  <p className="text-sm font-bold text-gray-400">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-bg-base/50 transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-8 py-4 ${col.className || ''}`}
                    >
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages !== undefined && totalPages > 1 && onPageChange && (
        <div className="px-8 py-6 border-t border-ui-border bg-bg-base flex justify-center items-center">
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, (currentPage || 0) - 1))}
              disabled={currentPage === 0}
              className="w-8 h-8 flex items-center justify-center border border-ui-border rounded-lg text-gray-400 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Loader2 className={`w-3 h-3 ${isLoading ? 'animate-spin' : 'hidden'}`} />
              {!isLoading && <span className="text-xs text-gray-500 font-bold">이전</span>}
            </button>

            {getDisplayPages().map((page, i) => (
              <React.Fragment key={i}>
                {page === '...' ? (
                  <span className="w-8 h-8 flex items-end justify-center text-gray-400 pb-2">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === page
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                      : 'border border-ui-border text-gray-400 hover:bg-white'
                      }`}
                  >
                    {page + 1}
                  </button>
                )}
              </React.Fragment>
            ))}

            <button
              onClick={() => onPageChange(Math.min((totalPages || 1) - 1, (currentPage || 0) + 1))}
              disabled={currentPage === (totalPages || 1) - 1}
              className="w-8 h-8 flex items-center justify-center border border-ui-border rounded-lg text-gray-400 hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {!isLoading && <span className="text-xs text-gray-500 font-bold">다음</span>}
              <Loader2 className={`w-3 h-3 ${isLoading ? 'animate-spin' : 'hidden'}`} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
