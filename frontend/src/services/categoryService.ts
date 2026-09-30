import api from "./api";
import { Category } from "@/types/category";

export async function getCategories() {
  const { data } = await api.get<{ data: Category[] }>("/categories", {
    params: { activeOnly: true },
  });
  return data.data;
}
