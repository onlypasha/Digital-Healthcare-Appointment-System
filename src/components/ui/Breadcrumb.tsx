import Link from 'next/link';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center text-sm text-[var(--color-outline)] mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="material-symbols-outlined mx-2 text-sm">chevron_right</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-primary)] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
