"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { useProducts } from "@/hooks/useProducts";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/types/category";

export default function ProductsPage() {
  const searchParams = useSearchParams();

  /*
   * Navbar search is the single product-search input.
   *
   * Example:
   * Navbar → /products?search=shoe
   * Products page → reads "shoe" from the URL
   */
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [page, setPage] = useState(1);

const [filters, setFilters] = useState({
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
});

  const [categories, setCategories] = useState<Category[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  /*
   * Keep product search synchronized with
   * the Navbar search URL.
   */
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  /*
   * Load categories for the filter drawer.
   */
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  /*
   * Prevent background scrolling while the
   * filter drawer is open.
   */
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [filtersOpen]);

  /*
   * Close the filter drawer with Escape.
   */
  useEffect(() => {
    if (!filtersOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [filtersOpen]);

  /*
   * Any search/filter/sort change starts
   * pagination from page 1.
   */
 useEffect(() => {
  setPage(1);
}, [
  search,
  filters.sort,
  filters.category,
  filters.minPrice,
  filters.maxPrice,
]);

  const { products, pagination, loading } = useProducts({
    search: search.trim() || undefined,
    sort: filters.sort,
    page,
    limit: 20,
    category: filters.category || undefined,
    minPrice: filters.minPrice
      ? Number(filters.minPrice)
      : undefined,
    maxPrice: filters.maxPrice
      ? Number(filters.maxPrice)
      : undefined,
  });

  return (
    <>
      <Container className="py-8 sm:py-10">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              All products
            </h1>

            {search && (
              <p className="mt-1 text-sm text-foreground/45">
                Search results for{" "}
                <span className="font-medium text-foreground/70">
                  "{search}"
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter button */}
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
className="
group
ml-auto
flex
h-11
items-center
gap-2
rounded-xl
border
border-border
bg-card
px-4
md:px-5
text-sm
font-medium
shadow-sm
transition-all
duration-200
hover:border-primary/40
hover:bg-primary/5
hover:text-primary
active:scale-[0.98]
"
              aria-label="Open product filters"
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>

              {(filters.category ||
                filters.minPrice ||
                filters.maxPrice) && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {
                                      [
                    filters.category,
                    filters.minPrice,
                    filters.maxPrice,
                    filters.sort !== "newest" ? "1" : "",
                  ].filter(Boolean).length
                  }
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            PRODUCT GRID
            ===================================================== */}
        <ProductGrid
          products={products}
          loading={loading}
        />

        {/* =====================================================
            PAGINATION
            ===================================================== */}
        {pagination && (
          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        )}
      </Container>

      {/* =======================================================
          FILTER DRAWER
          ======================================================= */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-[60] cursor-default bg-black/45 backdrop-blur-[3px]"
            />

            {/* =================================================
                MOBILE FILTER DRAWER
                Bottom sheet
                ================================================= */}
            <motion.aside
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed inset-x-0 bottom-0 z-[70] max-h-[85dvh] overflow-hidden rounded-t-3xl border-t border-border bg-background/95 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">
                    Filters
                  </h2>
                  <p className="mt-0.5 text-xs text-foreground/45">
                    Refine your product results
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="rounded-xl p-2 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[calc(85dvh-8rem)] overflow-y-auto p-5">
                <ProductFilters
                  categories={categories}
                  filters={filters}
                  onChange={setFilters}
                />
              </div>

              <div className="border-t border-border bg-background/90 p-4">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-[0.99]"
                >
                  Show products
                </button>
              </div>
            </motion.aside>

            {/* =================================================
                DESKTOP FILTER DRAWER
                Left-side panel
                ================================================= */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed inset-y-0 left-0 z-[70] hidden w-[400px] xl:w-[460px] flex-col border-r border-border bg-background/95 shadow-2xl backdrop-blur-2xl md:flex"
            >
              <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Filters
                  </h2>
                  <p className="mt-0.5 text-xs text-foreground/45">
                    Refine your product results
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="rounded-xl p-2.5 transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <ProductFilters
                  categories={categories}
                  filters={filters}
                  onChange={setFilters}
                />
              </div>

              <div className="shrink-0 border-t border-border bg-background/90 p-5">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-[0.99]"
                >
                  Show products
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
