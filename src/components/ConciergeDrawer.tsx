import { ArrowRight, Plus, RotateCcw, Send, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  CategoryFilter,
  ConciergeMessage,
  ProductItem,
} from '../types';
import { ResilientImage } from './ResilientImage';

interface ConciergeDrawerProps {
  isOpen: boolean;
  products: ProductItem[];
  activeCategory: CategoryFilter;
  onClose: () => void;
  onInspectProduct: (product: ProductItem) => void;
  onQuickAddProduct: (product: ProductItem) => void;
  onApplyCategoryFilter: (category: CategoryFilter) => void;
}

const CONCIERGE_STORAGE_KEY = 'aura_living_concierge_v1';

const STARTER_PROMPTS = [
  'Find sculptural lighting for a warm oak dining room',
  'Show me stoneware vessels under $250',
  'Recommend neutral textiles for a minimalist sofa',
  'Which pieces qualify for complimentary courier shipping?',
];

function readStoredThread(): ConciergeMessage[] {
  try {
    const raw = window.localStorage.getItem(CONCIERGE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is ConciergeMessage =>
        typeof entry?.id === 'string' &&
        (entry?.role === 'user' || entry?.role === 'model') &&
        typeof entry?.text === 'string'
    );
  } catch {
    return [];
  }
}

export function ConciergeDrawer({
  isOpen,
  products,
  activeCategory,
  onClose,
  onInspectProduct,
  onQuickAddProduct,
  onApplyCategoryFilter,
}: ConciergeDrawerProps) {
  const [messages, setMessages] = useState<ConciergeMessage[]>(() =>
    readStoredThread()
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CONCIERGE_STORAGE_KEY,
        JSON.stringify(messages.filter((m) => !m.isError))
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [messages]);

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

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, messages.length, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async (promptText: string, baseMessages?: ConciergeMessage[]) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const currentHistory = (baseMessages ?? messages).filter((m) => !m.isError);
    const userMessage: ConciergeMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextThread = [...currentHistory, userMessage];
    setMessages(nextThread);
    if (!baseMessages) {
      setInput('');
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/concierge/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeCategory,
          messages: nextThread.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        recommendedProductIds?: string[];
        suggestedCategory?: CategoryFilter;
        error?: string;
      };

      if (!response.ok || data.error) {
        throw new Error(
          data.error || 'Unable to reach Studio Concierge right now.'
        );
      }

      const modelMessage: ConciergeMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Here are pieces from our archive suited to your space.',
        recommendedProductIds: Array.isArray(data.recommendedProductIds)
          ? data.recommendedProductIds
          : [],
        suggestedCategory: data.suggestedCategory,
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach Studio Concierge right now.';

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: message,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleRetryLast = () => {
    const cleanHistory = messages.filter((m) => !m.isError);
    const lastUser = [...cleanHistory].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    const historyBeforeLast = cleanHistory.slice(
      0,
      cleanHistory.lastIndexOf(lastUser)
    );
    void sendMessage(lastUser.text, historyBeforeLast);
  };

  const handleResetThread = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="concierge-drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#1C1B1A]/35 backdrop-blur-[4px]"
      />

      <aside className="relative z-10 w-full max-w-[500px] h-full bg-[#FAF8F5] border-l border-[rgba(28,27,26,0.12)] contact-shadow flex flex-col">
        <div className="px-6 py-5 border-b border-[rgba(28,27,26,0.08)] flex items-center justify-between gap-4">
          <div>
            <h2
              id="concierge-drawer-title"
              className="font-serif text-[22px] leading-[28px] text-[#1c1c18]"
            >
              Studio Concierge
            </h2>
            <p className="label-caps text-[#7b766f] mt-0.5">
              Object Discovery & Material Guidance
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleResetThread}
                aria-label="Start new conversation"
                title="New Thread"
                className="h-10 px-3 inline-flex items-center gap-1.5 rounded-[4px] border border-[rgba(28,27,26,0.12)] text-[11px] font-semibold tracking-[0.06em] uppercase text-[#4a4640] hover:bg-[#ebe8e1] hover:text-[#1c1c18] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close studio concierge"
              className="w-10 h-10 inline-flex items-center justify-center rounded-[4px] border border-[rgba(28,27,26,0.12)] text-[#1c1c18] hover:bg-[#1C1B1A] hover:text-[#fcf9f2] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.length === 0 ? (
            <div className="space-y-6">
              <div className="p-5 rounded-[8px] bg-[#f1eee7] border border-[rgba(28,27,26,0.08)]">
                <p className="label-caps text-[#8d4e34]">Architectural Archive</p>
                <p className="mt-2 text-[14px] leading-[22px] text-[#4a4640]">
                  Ask about room pairings, material provenance, dimensions, or budget. I can recommend matching stoneware, alabaster lighting, undyed textiles, and timber furniture directly from our collection.
                </p>
              </div>

              <div>
                <p className="label-caps text-[#7b766f] mb-3">Suggested Inquiries</p>
                <div className="space-y-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="w-full text-left px-4 py-3 rounded-[4px] bg-[#fcf9f2] border border-[rgba(28,27,26,0.12)] hover:border-[#1C1B1A] hover:bg-[#f6f3ec] transition-colors text-[13px] leading-[20px] text-[#1c1c18] flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span>{prompt}</span>
                      <ArrowRight
                        className="w-3.5 h-3.5 text-[#7b766f] shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const matchedProducts = (message.recommendedProductIds ?? [])
                .map((id) => products.find((p) => p.id === id))
                .filter((p): p is ProductItem => Boolean(p));

              if (message.role === 'user') {
                return (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[85%] px-4 py-3 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] text-[14px] leading-[22px]">
                      {message.text}
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="flex flex-col items-start gap-3">
                  <div
                    className={`max-w-[92%] px-4 py-3.5 rounded-[4px] border text-[14px] leading-[22px] ${
                      message.isError
                        ? 'bg-[#ffdad6] border-[#ba1a1a]/25 text-[#93000a]'
                        : 'bg-[#f1eee7] border-[rgba(28,27,26,0.08)] text-[#1c1c18]'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>

                    {message.isError && (
                      <button
                        type="button"
                        onClick={handleRetryLast}
                        className="mt-3 h-8 px-3 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] text-[11px] font-semibold tracking-[0.06em] uppercase cursor-pointer"
                      >
                        Retry Inquiry
                      </button>
                    )}
                  </div>

                  {matchedProducts.length > 0 && (
                    <div className="w-full space-y-2.5">
                      {matchedProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 rounded-[8px] bg-[#fcf9f2] border border-[rgba(28,27,26,0.1)] flex items-center gap-3.5"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onInspectProduct(product);
                            }}
                            className="w-16 h-20 rounded-[4px] overflow-hidden bg-[#ebe8e1] shrink-0 cursor-pointer"
                          >
                            <ResilientImage
                              src={product.image}
                              alt={product.imageAlt}
                              className="w-full h-full object-cover"
                            />
                          </button>

                          <div className="flex-1 min-w-0">
                            <p className="label-caps text-[#7b766f]">
                              {product.category} · {product.sku}
                            </p>
                            <h3 className="mt-0.5 font-serif text-[16px] leading-[22px] text-[#1c1c18] truncate">
                              {product.title}
                            </h3>
                            <p className="mt-0.5 text-[13px] font-semibold text-[#1c1c18] tabular-nums">
                              ${product.price.toLocaleString('en-US')}
                            </p>
                          </div>

                          <div className="flex flex-col gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onInspectProduct(product);
                              }}
                              className="h-8 px-3 rounded-[4px] border border-[rgba(28,27,26,0.2)] text-[11px] font-semibold tracking-[0.06em] uppercase text-[#1c1c18] hover:bg-[#1C1B1A] hover:text-[#fcf9f2] transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => onQuickAddProduct(product)}
                              className="h-8 px-3 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors inline-flex items-center justify-center gap-1 text-[11px] font-semibold tracking-[0.06em] uppercase cursor-pointer whitespace-nowrap"
                            >
                              <Plus className="w-3 h-3" aria-hidden="true" />
                              <span>Bag</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {message.suggestedCategory &&
                    message.suggestedCategory !== 'All' && (
                      <button
                        type="button"
                        onClick={() => {
                          onApplyCategoryFilter(message.suggestedCategory!);
                          onClose();
                        }}
                        className="hairline-link text-[12px] font-semibold text-[#1c1c18] cursor-pointer"
                      >
                        <span>Filter collection to {message.suggestedCategory}</span>
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </button>
                    )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-[4px] bg-[#f1eee7] border border-[rgba(28,27,26,0.08)] text-[13px] text-[#4a4640]">
                Curating matching objects...
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 border-t border-[rgba(28,27,26,0.08)] bg-[#fcf9f2] flex items-center gap-2.5"
        >
          <label htmlFor="concierge-input" className="sr-only">
            Ask Studio Concierge about products or materials
          </label>
          <input
            ref={inputRef}
            id="concierge-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about finishes, sizing, or room pairings..."
            className="flex-1 min-w-0 h-[46px] px-3.5 rounded-[4px] bg-[#FAF8F5] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18] placeholder:text-[#7b766f] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send inquiry"
            className="h-[46px] px-4 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] disabled:opacity-40 disabled:hover:bg-[#1C1B1A] transition-colors inline-flex items-center justify-center gap-2 text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </aside>
    </div>
  );
}
