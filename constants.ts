
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  images?: string[];
  categoryId: string;
  brand?: string;
  colors?: { name: string; imageUrl: string }[];
  sizes?: string[];
  rating?: {
    stars: number;
    count: number;
    breakdown?: {
      '5': number;
      '4': number;
      '3': number;
      '2': number;
      '1': number;
    };
  };
  answeredQuestions?: number;
  reviews?: Review[];
  freeShipping?: boolean;
  deliveryFee?: number;
  deliveryTime?: string;
  warranty?: string;
  returnPolicy?: string;
  sold?: number;
  status?: string;
  specifications?: string;
  relatedIds?: string;
  featuredIndex?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  imageUrls?: string[];
  variantInfo?: string;
  sellerRating?: 'Positive' | 'Neutral' | 'Negative';
  isAnonymous?: boolean;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}
