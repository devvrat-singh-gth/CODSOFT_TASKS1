import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <AdminHeader title="Add product" />
      <ProductForm />
    </div>
  );
}
