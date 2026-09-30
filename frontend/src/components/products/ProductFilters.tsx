"use client";

import { Category } from "@/types/category";
import { Input } from "@/components/ui/Input";

interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

export function ProductFilters({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
 return (
  <div className="space-y-7">

    <div>
      <p className="mb-3 text-sm font-semibold">
        Sort by
      </p>

      <select
        value={filters.sort}
        onChange={(e) =>
          onChange({
            ...filters,
            sort: e.target.value,
          })
        }
        className="
          h-11
          w-full
          rounded-xl
          border
          border-border
          bg-background
          px-4
          text-sm
          transition-colors
          focus:border-primary
          focus:outline-none
        "
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="name-asc">Name: A → Z</option>
        <option value="name-desc">Name: Z → A</option>
      </select>
    </div>

    <div>
      <p className="mb-3 text-sm font-semibold">
        Category
      </p>

      <select
        value={filters.category}
        onChange={(e) =>
          onChange({
            ...filters,
            category: e.target.value,
          })
        }
        className="
          h-11
          w-full
          rounded-xl
          border
          border-border
          bg-background
          px-4
          text-sm
          focus:border-primary
          focus:outline-none
        "
      >
        <option value="">All categories</option>

        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <p className="mb-3 text-sm font-semibold">
        Price Range
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Input
          type="number"
          placeholder="Min"
          value={filters.minPrice}
          onChange={(e) =>
            onChange({
              ...filters,
              minPrice: e.target.value,
            })
          }
        />

        <Input
          type="number"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({
              ...filters,
              maxPrice: e.target.value,
            })
          }
        />
      </div>
    </div>

  </div>
);
}
