import api from "./api";
import { Order, ShippingAddress, PaymentMethod } from "@/types/order";
import { Pagination } from "@/types/product";

export async function createOrder(shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) {
  const { data } = await api.post<{ data: Order }>("/orders", { shippingAddress, paymentMethod });
  return data.data;
}

export async function getMyOrders(page = 1) {
  const { data } = await api.get<{ data: { orders: Order[]; pagination: Pagination } }>("/orders", {
    params: { page },
  });
  return data.data;
}

export async function getOrderById(id: string) {
  const { data } = await api.get<{ data: Order }>(`/orders/${id}`);
  return data.data;
}

export async function cancelOrder(id: string) {
  const { data } = await api.put<{ data: Order }>(`/orders/${id}/cancel`);
  return data.data;
}
