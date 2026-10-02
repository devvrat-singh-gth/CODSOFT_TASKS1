import api from "./api";
import { Product, ProductListResponse } from "@/types/product";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  featured?: boolean;
  sort?: string;
}

export async function getProducts(params: ProductQueryParams = {}) {
  const { data } = await api.get<{ data: ProductListResponse }>("/products", { params });
  return data.data;
}

export async function getProductById(id: string) {
  const { data } = await api.get<{ data: Product }>(`/products/${id}`);
  return data.data;
}
export async function getProductBySlug(slug: string) {
  const { data } = await api.get<{ data: Product }>(
    `/products/slug/${slug}`
  );

  return data.data;
}