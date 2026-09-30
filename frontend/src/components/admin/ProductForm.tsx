"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import api from "@/services/api";

interface Props {
  initial?: Product;
}

// Handles both create and edit. Sends multipart/form-data so image files can
// go straight through to the backend's uploadMiddleware -> Cloudinary flow.
export function ProductForm({ initial }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    brand: initial?.brand || "",
    category: typeof initial?.category === "object" ? initial.category._id : initial?.category || "",
    price: initial?.price?.toString() || "",
    discountPrice: initial?.discountPrice?.toString() || "",
    stock: initial?.stock?.toString() || "",
    sku: initial?.sku || "",
    isFeatured: initial?.isFeatured || false,
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
  fd.append(k, String(v));
});
      if (files) Array.from(files).forEach((f) => fd.append("images", f));

      if (initial) {
        await api.put(`/products/${initial._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated");
      } else {
        await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Product created");
      }
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <Input placeholder="Product name" value={form.name} onChange={set("name")} />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={set("description")}
        rows={4}
        className="w-full rounded-lg border border-border bg-background p-3 text-sm"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Brand" value={form.brand} onChange={set("brand")} />
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input placeholder="Price" type="number" value={form.price} onChange={set("price")} />
        <Input
          placeholder="Discount price"
          type="number"
          value={form.discountPrice}
          onChange={set("discountPrice")}
        />
        <Input placeholder="Stock" type="number" value={form.stock} onChange={set("stock")} />
      </div>
      <Input placeholder="SKU" value={form.sku} onChange={set("sku")} />
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              isFeatured: e.target.checked,
            }))
          }
          className="h-4 w-4 rounded border-border accent-primary"
        />

        <span>
          <span className="block text-sm font-medium">
            Featured product
          </span>

          <span className="mt-0.5 block text-xs text-foreground/45">
            Show this product in the homepage featured section.
          </span>
        </span>
      </label>
      <div>
        <label className="mb-1 block text-sm font-medium">Images</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
      </div>

      <Button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : initial ? "Update product" : "Create product"}
      </Button>
    </div>
  );
}
