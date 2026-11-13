import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { CategoryFilter } from '../types';

interface HeaderProps {
  bagCount: number;
  onOpenBag: () => void;
  onNavigateCategory: (category: CategoryFilter) => void;
  onNavigateAtelier: () => void;
  onOpenMonograph: () => void;
}

export function Header({
  bagCount,
  onOpenBag,
  onNavigateCategory,
  onNavigateAtelier,
  onOpenMonograph,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#fcf9f2]/95 backdrop-blur-sm border-b border-[rgba(28,27,26,0.08)]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-16 h-16 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-serif text-[21px] tracking-[-0.015em] text-[#1c1c18] whitespace-nowrap shrink-0 focus-visible:outline-1 focus-visible:outline-[#1C1B1A] focus-visible:outline-offset-4"
        >
          AURA Living
        </a>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#4a4640]"
        >
          <button
            type="button"
            onClick={() => onNavigateCategory('All')}
            className="hover:text-[#1c1c18] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1c1c18]"
          >
            Collection
          </button>
          <button
            type="button"
            onClick={() => onNavigateCategory('Ceramics')}
            className="hover:text-[#1c1c18] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1c1c18]"
          >
            Ceramics
          </button>
          <button
            type="button"
            onClick={onNavigateAtelier}
            className="hover:text-[#1c1c18] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1c1c18]"
          >
            Atelier
          </button>
          <button
            type="button"
            onClick={onOpenMonograph}
            className="hover:text-[#1c1c18] transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1c1c18]"
          >
            Monograph
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            aria-label={`Open shopping bag with ${bagCount} items`}
            className="inline-flex items-center gap-2.5 h-10 px-4 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#8d4e34] transition-colors duration-180 text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-1 focus-visible:outline-[#1C1B1A] focus-visible:outline-offset-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.75} aria-hidden="true" />
            <span>Bag</span>
            <span className="tabular-nums opacity-90">({bagCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[4px] border border-[rgba(28,27,26,0.15)] text-[#1c1c18] hover:bg-[#ebe8e1] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[rgba(28,27,26,0.08)] bg-[#FAF8F5] px-5 py-4">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateCategory('All'))}
              className="text-left py-2.5 text-[14px] font-medium text-[#1c1c18] border-b border-[rgba(28,27,26,0.06)]"
            >
              Collection
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(() => onNavigateCategory('Ceramics'))}
              className="text-left py-2.5 text-[14px] font-medium text-[#1c1c18] border-b border-[rgba(28,27,26,0.06)]"
            >
              Ceramics
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(onNavigateAtelier)}
              className="text-left py-2.5 text-[14px] font-medium text-[#1c1c18] border-b border-[rgba(28,27,26,0.06)]"
            >
              Atelier
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick(onOpenMonograph)}
              className="text-left py-2.5 text-[14px] font-medium text-[#1c1c18]"
            >
              Monograph
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
