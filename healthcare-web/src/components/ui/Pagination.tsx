import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-outline-variant)]">
      <p className="text-sm text-[var(--color-outline)]">
        Showing page <span className="font-medium text-black">{currentPage}</span> of <span className="font-medium text-black">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded text-[var(--color-outline)] hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              currentPage === page 
                ? 'bg-[var(--color-primary)] text-white' 
                : 'text-[var(--color-outline)] hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded text-[var(--color-outline)] hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
