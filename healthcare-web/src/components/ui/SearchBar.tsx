import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

export function SearchBar({ placeholder = "Search...", value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="relative max-w-md w-full">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)]">
        search
      </span>
      <input 
        type="text" 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' && onSearch && onSearch()}
        className="w-full pl-10 pr-4 py-2 border border-[var(--color-outline-variant)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all bg-white"
      />
    </div>
  );
}
