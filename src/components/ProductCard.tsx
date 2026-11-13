import { Plus } from 'lucide-react';
import { ProductItem } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
  onQuickAdd: (product: ProductItem) => void;
}

export function ProductCard({ product, onSelect, onQuickAdd }: ProductCardProps) {
  return (
    <article className="group flex flex-col bg-[#FAF8F5] border border-[rgba(28,27,26,0.08)] rounded-[8px] overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-4px_rgba(28,27,26,0.05)]">
      <div className="relative aspect-[4/5] bg-[#ebe8e1] overflow-hidden">
        <button
          type="button"
          onClick={() => onSelect(product)}
          aria-label={`View details for ${product.title}`}
          className="block w-full h-full text-left cursor-pointer focus-visible:outline-1 focus-visible:outline-[#1C1B1A]"
        >
          <ResilientImage
            src={product.image}
            alt={product.imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex justify-end md:opacity-0 md:translate-y-1.5 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:focus-within:opacity-100 md:focus-within:translate-y-0 transition-all duration-180 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            aria-label={`Quick add ${product.title} to shopping bag`}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-[4px] bg-[#1C1B1A]/95 text-[#fcf9f2] hover:bg-[#8d4e34] text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 backdrop-blur-xs"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-[#7b766f]">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span
              className={
                product.availability === 'Limited Run'
                  ? 'text-[#8d4e34]'
                  : 'text-[#7b766f]'
              }
            >
              {product.availability}
            </span>
          </div>

          <h3 className="mt-2 font-serif text-[20px] font-medium leading-[28px] text-[#1c1c18]">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="text-left hover:text-[#8d4e34] transition-colors duration-150 cursor-pointer"
            >
              {product.title}
            </button>
          </h3>

          <p className="mt-1 text-[13px] leading-[20px] text-[#4a4640] line-clamp-2">
            {product.shortNote}
          </p>
        </div>

        <div className="pt-3 border-t border-[rgba(28,27,26,0.08)] flex items-center justify-between gap-3">
          <span className="text-[15px] font-semibold text-[#1c1c18] tabular-nums">
            ${product.price.toLocaleString('en-US')}
          </span>
          <span className="text-[12px] text-[#7b766f] tabular-nums">
            {product.finishes.length} {product.finishes.length === 1 ? 'finish' : 'finishes'}
          </span>
        </div>
      </div>
    </article>
  );
}
