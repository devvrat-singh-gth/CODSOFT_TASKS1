export interface ProductImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand?: string;
  category: { _id: string; name: string; slug: string } | string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  images: ProductImage[];
  specifications: { key: string; value: string }[];
  ratingAverage: number;
  ratingCount: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}
