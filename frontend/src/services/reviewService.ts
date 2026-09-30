import api from "./api";

export async function getProductReviews(productId: string, page = 1) {
  const { data } = await api.get(`/products/${productId}/reviews`, { params: { page } });
  return data.data;
}

export async function createReview(
  productId: string,
  payload: { orderId: string; rating: number; title?: string; comment: string }
) {
  const { data } = await api.post(`/products/${productId}/reviews`, payload);
  return data.data;
}
