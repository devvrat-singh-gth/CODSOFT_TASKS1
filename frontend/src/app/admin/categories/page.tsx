"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Category } from "@/types/category";
import { getCategories } from "@/services/categoryService";
import api from "@/services/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => getCategories().then(setCategories);
  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();

fd.append("name", name);

if (description) {
  fd.append("description", description);
}

if (image) {
  fd.append("image", image);
}

await api.post("/categories", fd, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
      setName("");
      toast.success("Category created");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader title="Categories" />

      <div className="mb-6 flex max-w-md gap-2">
        <Input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <Button onClick={handleCreate} disabled={saving}>
          Add
        </Button>
      </div>

      <DataTable<Category>
        rows={categories}
        columns={[
          { header: "Name", render: (c) => c.name },
          { header: "Slug", render: (c) => c.slug },
          { header: "Status", render: (c) => <Badge>{c.isActive ? "Active" : "Inactive"}</Badge> },
        ]}
      />
    </div>
  );
}
