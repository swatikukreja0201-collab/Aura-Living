import { ArrowRight, X } from 'lucide-react';
import { useEffect } from 'react';
import { ATELIER_CHAPTERS, EDITORIAL_MEDIA } from '../data/catalog';
import { CategoryFilter } from '../types';
import { ResilientImage } from './ResilientImage';

interface AtelierMonographModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreCategory: (category: CategoryFilter) => void;
}

export function AtelierMonographModal({
  isOpen,
  onClose,
  onExploreCategory,
}: AtelierMonographModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="monograph-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#1C1B1A]/35 backdrop-blur-[4px]"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FAF8F5] border border-[rgba(28,27,26,0.12)] rounded-[8px] contact-shadow">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close atelier monograph"
          className="absolute top-4 right-4 z-20 w-10 h-10 inline-flex items-center justify-center rounded-[4px] bg-[#FAF8F5]/90 border border-[rgba(28,27,26,0.12)] text-[#1c1c18] hover:bg-[#1C1B1A] hover:text-[#fcf9f2] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="aspect-[16/9] bg-[#ebe8e1] overflow-hidden">
          <ResilientImage
            src={EDITORIAL_MEDIA.atelier.src}
            alt={EDITORIAL_MEDIA.atelier.alt}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="max-w-2xl">
            <p className="label-caps text-[#8d4e34]">Atelier Monograph · Issue 04</p>
            <h2
              id="monograph-modal-title"
              className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[42px] tracking-[-0.015em] text-[#1c1c18]"
            >
              Quiet Permanence in Clay, Flax & Stone
            </h2>
            <p className="mt-4 text-[16px] leading-[26px] text-[#4a4640]">
              Our seasonal archive brings together small workshops across Bornholm, Shigaraki, Antwerp, and Tivoli—united by materials that age gracefully in quiet architectural rooms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[rgba(28,27,26,0.08)]">
            {ATELIER_CHAPTERS.map((chapter) => (
              <div key={chapter.index} className="space-y-2.5">
                <span className="label-caps text-[#7b766f] tabular-nums">
                  {chapter.index}.
                </span>
                <h3 className="font-serif text-[18px] leading-[26px] text-[#1c1c18]">
                  {chapter.title}
                </h3>
                <p className="text-[14px] leading-[22px] text-[#4a4640]">
                  {chapter.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-[rgba(28,27,26,0.08)] flex flex-wrap items-center justify-between gap-4">
            <span className="text-[13px] text-[#7b766f]">
              Browse objects crafted from these raw materials:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {(['Ceramics', 'Textiles', 'Furniture'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    onClose();
                    onExploreCategory(cat);
                  }}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[4px] border border-[rgba(28,27,26,0.25)] text-[12px] font-semibold tracking-[0.06em] uppercase text-[#1c1c18] hover:bg-[#1C1B1A] hover:text-[#fcf9f2] transition-colors cursor-pointer"
                >
                  <span>{cat}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
