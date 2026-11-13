export type ProductCategory = 'Ceramics' | 'Lighting' | 'Textiles' | 'Furniture';

export type CategoryFilter = 'All' | ProductCategory;

export type SortOrder = 'featured' | 'price-asc' | 'price-desc';

export interface ProductFinish {
  name: string;
  swatch: string;
}

export interface ProductMetadata {
  id: string;
  sku: string;
  title: string;
  category: ProductCategory;
  price: number;
  availability: 'In Stock' | 'Limited Run';
  imageAlt: string;
  shortNote: string;
  description: string;
  dimensions: string;
  materials: string;
  origin: string;
  care: string;
  finishes: ProductFinish[];
}

export interface ProductItem extends ProductMetadata {
  image: string;
}

export interface BagItem {
  productId: string;
  finishName: string;
  quantity: number;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface ConfirmedOrder {
  orderNumber: string;
  placedAt: string;
  items: Array<{
    productId: string;
    title: string;
    sku: string;
    finishName: string;
    unitPrice: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shipping: ShippingDetails;
}

export interface ConciergeMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendedProductIds?: string[];
  suggestedCategory?: CategoryFilter;
  isError?: boolean;
}
