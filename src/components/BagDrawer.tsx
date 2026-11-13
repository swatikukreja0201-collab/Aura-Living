import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/catalog';
import { BagItem, ConfirmedOrder, ProductItem, ShippingDetails } from '../types';
import { ResilientImage } from './ResilientImage';

interface BagDrawerProps {
  isOpen: boolean;
  items: BagItem[];
  products: ProductItem[];
  latestOrder: ConfirmedOrder | null;
  onClose: () => void;
  onUpdateQuantity: (productId: string, finishName: string, delta: number) => void;
  onRemoveItem: (productId: string, finishName: string) => void;
  onPlaceOrder: (shipping: ShippingDetails) => ConfirmedOrder;
  onBrowseCollection: () => void;
}

type DrawerStep = 'bag' | 'shipping' | 'confirmed';

const INITIAL_SHIPPING: ShippingDetails = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
};

export function BagDrawer({
  isOpen,
  items,
  products,
  latestOrder,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onBrowseCollection,
}: BagDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('bag');
  const [shipping, setShipping] = useState<ShippingDetails>(INITIAL_SHIPPING);
  const [formError, setFormError] = useState<string>('');
  const [activeOrder, setActiveOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormError('');
      if (items.length > 0 && step === 'confirmed') {
        setStep('bag');
      }
    }
  }, [isOpen, items.length, step]);

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

  const resolvedItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = resolvedItems.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );
  const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost =
    resolvedItems.length === 0 ? 0 : qualifiesFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shippingCost;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckoutSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (
      !shipping.fullName.trim() ||
      !shipping.email.trim() ||
      !shipping.address.trim() ||
      !shipping.city.trim() ||
      !shipping.postalCode.trim()
    ) {
      setFormError('Please complete all required delivery fields before placing your order.');
      return;
    }
    if (!shipping.email.includes('@')) {
      setFormError('Please enter a valid email address for order confirmation.');
      return;
    }
    setFormError('');
    const confirmed = onPlaceOrder(shipping);
    setActiveOrder(confirmed);
    setShipping(INITIAL_SHIPPING);
    setStep('confirmed');
  };

  const displayedOrder = activeOrder ?? latestOrder;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="bag-drawer-title"
      className="fixed inset-0 z-50 flex justify-end"
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-[#1C1B1A]/35 backdrop-blur-[4px]"
      />

      <aside className="relative z-10 w-full max-w-[480px] h-full bg-[#FAF8F5] border-l border-[rgba(28,27,26,0.12)] contact-shadow flex flex-col">
        <div className="px-6 py-5 border-b border-[rgba(28,27,26,0.08)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {step === 'shipping' && (
              <button
                type="button"
                onClick={() => setStep('bag')}
                aria-label="Back to shopping bag"
                className="w-9 h-9 inline-flex items-center justify-center rounded-[4px] border border-[rgba(28,27,26,0.15)] text-[#1c1c18] hover:bg-[#ebe8e1] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2
                id="bag-drawer-title"
                className="font-serif text-[22px] leading-[28px] text-[#1c1c18]"
              >
                {step === 'bag' && 'Shopping Bag'}
                {step === 'shipping' && 'Delivery Details'}
                {step === 'confirmed' && 'Order Confirmed'}
              </h2>
              {step === 'bag' && (
                <p className="label-caps text-[#7b766f] mt-0.5 tabular-nums">
                  {resolvedItems.reduce((sum, entry) => sum + entry.quantity, 0)}{' '}
                  {resolvedItems.reduce((sum, entry) => sum + entry.quantity, 0) === 1
                    ? 'Object'
                    : 'Objects'}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="w-10 h-10 inline-flex items-center justify-center rounded-[4px] border border-[rgba(28,27,26,0.12)] text-[#1c1c18] hover:bg-[#1C1B1A] hover:text-[#fcf9f2] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'bag' && (
          <>
            {resolvedItems.length > 0 && (
              <div className="px-6 py-3.5 bg-[#f1eee7] border-b border-[rgba(28,27,26,0.08)]">
                <div className="flex items-center justify-between text-[12px] text-[#4a4640]">
                  <span>
                    {qualifiesFreeShipping ? (
                      'Complimentary courier shipping unlocked'
                    ) : (
                      <>
                        Add{' '}
                        <span className="font-semibold text-[#1c1c18] tabular-nums">
                          ${remainingForFreeShipping.toLocaleString('en-US')}
                        </span>{' '}
                        for complimentary shipping
                      </>
                    )}
                  </span>
                  <span className="tabular-nums font-medium">{progressPercent}%</span>
                </div>
                <div className="mt-2 h-1 w-full bg-[#dcdad3] overflow-hidden rounded-[2px]">
                  <div
                    className="h-full bg-[#1C1B1A] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {resolvedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-[4px] bg-[#ebe8e1] flex items-center justify-center text-[#4a4640] mb-4">
                    <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-[20px] text-[#1c1c18]">
                    Your bag is currently empty
                  </h3>
                  <p className="mt-2 text-[14px] text-[#4a4640] max-w-xs">
                    Explore handcrafted stoneware, alabaster lighting, and architectural oak pieces.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBrowseCollection();
                    }}
                    className="mt-6 h-11 px-6 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors text-[12px] font-semibold tracking-[0.06em] uppercase cursor-pointer"
                  >
                    Browse Collection
                  </button>

                  {latestOrder && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveOrder(latestOrder);
                        setStep('confirmed');
                      }}
                      className="mt-5 text-[13px] text-[#4a4640] hairline-link cursor-pointer"
                    >
                      View recent receipt ({latestOrder.orderNumber})
                    </button>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-[rgba(28,27,26,0.08)]">
                  {resolvedItems.map(({ product, finishName, quantity }) => (
                    <li
                      key={`${product.id}-${finishName}`}
                      className="py-5 first:pt-0 flex gap-4"
                    >
                      <div className="w-20 h-24 rounded-[4px] overflow-hidden bg-[#ebe8e1] shrink-0">
                        <ResilientImage
                          src={product.image}
                          alt={product.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-serif text-[16px] leading-[22px] text-[#1c1c18] truncate">
                              {product.title}
                            </h3>
                            <p className="text-[12px] text-[#7b766f] mt-0.5 truncate">
                              {finishName}
                            </p>
                          </div>
                          <span className="text-[14px] font-semibold text-[#1c1c18] tabular-nums shrink-0">
                            ${(product.price * quantity).toLocaleString('en-US')}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center h-8 px-1 rounded-[4px] border border-[rgba(28,27,26,0.16)] bg-[#fcf9f2]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, finishName, -1)}
                              aria-label={`Decrease quantity of ${product.title}`}
                              className="w-6 h-6 inline-flex items-center justify-center text-[#1c1c18] hover:bg-[#ebe8e1] rounded-[2px] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-[13px] font-medium tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(product.id, finishName, 1)}
                              aria-label={`Increase quantity of ${product.title}`}
                              className="w-6 h-6 inline-flex items-center justify-center text-[#1c1c18] hover:bg-[#ebe8e1] rounded-[2px] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id, finishName)}
                            className="text-[12px] text-[#7b766f] hover:text-[#1c1c18] underline underline-offset-4 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {resolvedItems.length > 0 && (
              <div className="p-6 border-t border-[rgba(28,27,26,0.08)] bg-[#fcf9f2] space-y-4">
                <div className="space-y-2 text-[14px]">
                  <div className="flex items-center justify-between text-[#4a4640]">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-[#1c1c18]">
                      ${subtotal.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#4a4640]">
                    <span>Courier Shipping</span>
                    <span className="tabular-nums text-[#1c1c18]">
                      {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[rgba(28,27,26,0.08)] flex items-center justify-between text-[15px] font-semibold text-[#1c1c18]">
                    <span>Estimated Total</span>
                    <span className="tabular-nums">${total.toLocaleString('en-US')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="w-full h-12 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors duration-180 text-[13px] font-semibold tracking-[0.06em] uppercase cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {step === 'shipping' && (
          <form
            onSubmit={handleCheckoutSubmit}
            className="flex-1 flex flex-col justify-between overflow-y-auto"
          >
            <div className="p-6 space-y-5">
              <p className="text-[14px] leading-[22px] text-[#4a4640]">
                Enter your delivery destination. All architectural pieces ship insured from our Copenhagen and Kyoto ateliers.
              </p>

              {formError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-[4px] bg-[#ffdad6] text-[#93000a] text-[13px] leading-[20px] border border-[#ba1a1a]/20"
                >
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="checkout-name" className="block label-caps text-[#4a4640] mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder="Soren Lindqvist"
                    className="w-full h-[46px] px-3.5 rounded-[4px] bg-[#fcf9f2] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18]"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-email" className="block label-caps text-[#4a4640] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="soren@studio-nord.dk"
                    className="w-full h-[46px] px-3.5 rounded-[4px] bg-[#fcf9f2] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18]"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-address" className="block label-caps text-[#4a4640] mb-1.5">
                    Street Address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="Bredgade 45, 2. sal"
                    className="w-full h-[46px] px-3.5 rounded-[4px] bg-[#fcf9f2] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-city" className="block label-caps text-[#4a4640] mb-1.5">
                      City
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="Copenhagen"
                      className="w-full h-[46px] px-3.5 rounded-[4px] bg-[#fcf9f2] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18]"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-postal" className="block label-caps text-[#4a4640] mb-1.5">
                      Postal Code
                    </label>
                    <input
                      id="checkout-postal"
                      type="text"
                      required
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      placeholder="1260"
                      className="w-full h-[46px] px-3.5 rounded-[4px] bg-[#fcf9f2] border border-[rgba(28,27,26,0.15)] focus:border-[#1C1B1A] focus:outline-none text-[14px] text-[#1c1c18] tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[rgba(28,27,26,0.08)] bg-[#fcf9f2] space-y-4">
              <div className="flex items-center justify-between text-[15px] font-semibold text-[#1c1c18]">
                <span>Total Due on Dispatch</span>
                <span className="tabular-nums">${total.toLocaleString('en-US')}</span>
              </div>
              <button
                type="submit"
                className="w-full h-12 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors duration-180 text-[13px] font-semibold tracking-[0.06em] uppercase cursor-pointer"
              >
                Place Order
              </button>
            </div>
          </form>
        )}

        {step === 'confirmed' && displayedOrder && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="p-5 rounded-[8px] bg-[#f1eee7] border border-[rgba(28,27,26,0.08)]">
                <div className="flex items-center gap-2.5 text-[#1c1c18]">
                  <CheckCircle2 className="w-5 h-5 text-[#8d4e34]" />
                  <span className="label-caps text-[#8d4e34]">Preparing Shipment</span>
                </div>
                <h3 className="mt-2 font-serif text-[22px] text-[#1c1c18]">
                  Order {displayedOrder.orderNumber} Confirmed
                </h3>
                <p className="mt-1.5 text-[13px] leading-[20px] text-[#4a4640]">
                  A dispatch dossier has been logged for{' '}
                  <span className="text-[#1c1c18] font-medium">
                    {displayedOrder.shipping.email}
                  </span>
                  .
                </p>
              </div>

              <div className="mt-6">
                <h4 className="label-caps text-[#7b766f] pb-2 border-b border-[rgba(28,27,26,0.08)]">
                  Destination
                </h4>
                <p className="mt-2.5 text-[14px] leading-[22px] text-[#1c1c18]">
                  {displayedOrder.shipping.fullName}
                  <br />
                  {displayedOrder.shipping.address}
                  <br />
                  {displayedOrder.shipping.city}, {displayedOrder.shipping.postalCode}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="label-caps text-[#7b766f] pb-2 border-b border-[rgba(28,27,26,0.08)]">
                  Objects Reserved
                </h4>
                <ul className="divide-y divide-[rgba(28,27,26,0.08)]">
                  {displayedOrder.items.map((item) => (
                    <li
                      key={`${item.productId}-${item.finishName}`}
                      className="py-3.5 flex items-center justify-between gap-3 text-[14px]"
                    >
                      <div>
                        <p className="font-medium text-[#1c1c18]">
                          {item.title} × <span className="tabular-nums">{item.quantity}</span>
                        </p>
                        <p className="text-[12px] text-[#7b766f]">{item.finishName}</p>
                      </div>
                      <span className="font-semibold tabular-nums text-[#1c1c18]">
                        ${(item.unitPrice * item.quantity).toLocaleString('en-US')}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-[rgba(28,27,26,0.12)] flex items-center justify-between text-[15px] font-semibold text-[#1c1c18]">
                  <span>Total</span>
                  <span className="tabular-nums">
                    ${displayedOrder.total.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep('bag');
                onClose();
              }}
              className="w-full h-12 rounded-[4px] bg-[#1C1B1A] text-[#fcf9f2] hover:bg-[#C47B5E] transition-colors text-[13px] font-semibold tracking-[0.06em] uppercase cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
