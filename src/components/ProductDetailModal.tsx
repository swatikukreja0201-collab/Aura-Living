import { Check, Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductItem } from '../types';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToBag: (product: ProductItem, finishName: string, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToBag,
}: ProductDetailModalProps) {
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedFinish(product.finishes[0]?.name ?? '');
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleSubmit = () => {
    onAddToBag(product, selectedFinish, quantity);
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
    }, 1600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#1C1B1A]/35 backdrop-blur-[4px]"
      />

      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#FAF8F5] border border-[rgba(28,27,26,0.12)] rounded-[8px] contact-shadow grid grid-cols-1 lg:grid-cols-12">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-20 w-10 h-10 inline-flex items-center justify-center rounded-[4px] bg-[#FAF8F5]/90 border border-[rgba(28,27,26,0.12)] text-[#1c1c18] hover:bg-[#1C1B1A] hover:text-[#fcf9f2] transition-colors duration-150 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="lg:col-span-6 bg-[#ebe8e1] aspect-[4/5] lg:aspect-auto lg:min-h-[560px]">
          <ResilientImage
            src={product.image}
            alt={product.imageAlt}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 label-caps text-[#7b766f]">
              <span>{product.sku}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span
                className={
                  product.availability === 'Limited Run'
                    ? 'text-[#8d4e34]'
                    : 'text-[#4a4640]'
                }
              >
                {product.availability}
              </span>
            </div>

            <h2
              id="product-modal-title"
              className="mt-3 font-serif text-[28px] sm:text-[32px] leading-[38px] tracking-[-0.015em] text-[#1c1c18]"
            >
              {product.title}
            </h2>

            <p className="mt-2 text-[18px] font-semibold text-[#1c1c18] tabular-nums">
              ${product.price.toLocaleString('en-US')}
            </p>

            <p className="mt-5 text-[15px] leading-[25px] text-[#4a4640]">
              {product.description}
            </p>

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <span className="label-caps text-[#4a4640]">Material Finish</span>
                <span className="text-[13px] font-medium text-[#1c1c18]">
                  {selectedFinish}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.finishes.map((finish) => {
                  const isActive = finish.name === selectedFinish;
                  return (
                    <button
                      key={finish.name}
                      type="button"
                      onClick={() => setSelectedFinish(finish.name)}
                      className={`inline-flex items-center gap-2.5 h-10 px-3.5 rounded-[4px] border text-[13px] transition-colors duration-150 cursor-pointer ${
                        isActive
                          ? 'border-[#1C1B1A] bg-[#1C1B1A] text-[#fcf9f2]'
                          : 'border-[rgba(28,27,26,0.18)] bg-transparent text-[#1c1c18] hover:bg-[rgba(28,27,26,0.04)]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full border border-[rgba(28,27,26,0.2)] shrink-0"
                        style={{ backgroundColor: finish.swatch }}
                      />
                      <span className="whitespace-nowrap">{finish.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <dl className="mt-7 border-t border-[rgba(28,27,26,0.08)] divide-y divide-[rgba(28,27,26,0.08)] text-[13px]">
              <div className="py-3 flex items-start justify-between gap-4">
                <dt className="label-caps text-[#7b766f] pt-0.5 shrink-0">Dimensions</dt>
                <dd className="text-right text-[#1c1c18] tabular-nums">{product.dimensions}</dd>
              </div>
              <div className="py-3 flex items-start justify-between gap-4">
                <dt className="label-caps text-[#7b766f] pt-0.5 shrink-0">Materials</dt>
                <dd className="text-right text-[#1c1c18]">{product.materials}</dd>
              </div>
              <div className="py-3 flex items-start justify-between gap-4">
                <dt className="label-caps text-[#7b766f] pt-0.5 shrink-0">Provenance</dt>
                <dd className="text-right text-[#1c1c18]">{product.origin}</dd>
              </div>
              <div className="py-3 flex items-start justify-between gap-4">
                <dt className="label-caps text-[#7b766f] pt-0.5 shrink-0">Care</dt>
                <dd className="text-right text-[#4a4640]">{product.care}</dd>
              </div>
            </dl>
          </div>

          <div className="pt-4 border-t border-[rgba(28,27,26,0.08)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="inline-flex items-center justify-between h-12 px-2 rounded-[4px] border border-[rgba(28,27,26,0.2)] bg-[#fcf9f2] sm:w-32 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 inline-flex items-center justify-center text-[#1c1c18] hover:bg-[#ebe8e1] rounded-[4px] transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-[14px] font-semibold tabular-nums text-[#1c1c18]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 inline-flex items-center justify-center text-[#1c1c18] hover:bg-[#ebe8e1] rounded-[4px] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-12 px-6 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors duration-180 inline-flex items-center justify-center gap-2 text-[13px] font-semibold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <span className="tabular-nums">
                  Add to Bag — ${(product.price * quantity).toLocaleString('en-US')}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
