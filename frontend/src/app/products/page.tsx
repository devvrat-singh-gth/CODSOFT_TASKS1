"use client";

import { Suspense, useEffect, useState } from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Pagination } from "@/components/ui/Pagination";
import { useProducts } from "@/hooks/useProducts";
import { getCategories } from "@/services/categoryService";
import { Category } from "@/types/category";

function ProductsPageContent() {
const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();

const urlSearch =
  searchParams.get("search") || "";

const pageFromUrl = Number(
  searchParams.get("page") || "1"
);

const [search, setSearch] =
  useState(urlSearch);

const [page, setPage] =
  useState(pageFromUrl);

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
useEffect(() => {
  setPage(pageFromUrl);
}, [pageFromUrl]);
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
    document.body.style.overflow = filtersOpen
      ? "hidden"
      : "";

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

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [filtersOpen]);

  /*
   * Any search/filter/sort change starts
   * pagination from page 1.
   */
useEffect(() => {
  const params =
    new URLSearchParams(
      searchParams.toString()
    );

  params.delete("page");

  router.replace(
    `${pathname}?${params.toString()}`,
    {
      scroll: false,
    }
  );
}, [
  search,
  filters.sort,
  filters.category,
  filters.minPrice,
  filters.maxPrice,
  pathname,
  router,
  searchParams,
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

  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sort !== "newest" ? "sort" : "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
  };

  return (
    <>
      <Container className="py-7 sm:py-9 lg:py-12 xl:py-14 2xl:py-16">
        {/* =====================================================
            PAGE HEADER
            ===================================================== */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary sm:text-xs">
                Explore the collection
              </p>

              <h1 className="text-[clamp(1.8rem,3.5vw,3.6rem)] font-semibold leading-tight tracking-tight">
                All products
              </h1>

              {search && (
                <p className="mt-2 max-w-2xl truncate text-[clamp(0.78rem,0.9vw,0.95rem)] text-foreground/45">
                  Search results for{" "}
                  <span className="font-medium text-foreground/70">
                    "{search}"
                  </span>
                </p>
              )}
            </div>

            <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground/50 transition-colors hover:bg-primary/10 hover:text-primary sm:px-3"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}

              {/* Filter button */}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="group ml-auto flex h-11 items-center gap-2 rounded-xl border border-border bg-card/70 px-4 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary active:scale-[0.98] sm:px-5"
                aria-label="Open product filters"
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="h-4 w-4 transition-transform duration-200 group-hover:rotate-6" />

                <span>Filters</span>

                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Result summary */}
          {!loading && pagination && (
            <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
              <p className="text-xs text-foreground/40 sm:text-sm">
                {pagination.total}{" "}
                {pagination.total === 1
                  ? "product"
                  : "products"}
              </p>

              {hasActiveFilters && (
                <p className="text-xs font-medium text-primary/80 sm:text-sm">
                  {activeFilterCount} active{" "}
                  {activeFilterCount === 1
                    ? "filter"
                    : "filters"}
                </p>
              )}
            </div>
          )}
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
  onPageChange={(newPage) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.set(
      "page",
      String(newPage)
    );

    router.push(
      `${pathname}?${params.toString()}`
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }}
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
              className="fixed inset-0 z-[60] cursor-default bg-black/50 backdrop-blur-[4px]"
            />

            {/* =================================================
                MOBILE / TABLET FILTER DRAWER
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
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[88dvh] flex-col overflow-hidden rounded-t-[1.75rem] border-t border-border bg-background/95 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              {/* Mobile header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border/70 px-5 py-4 sm:px-6 sm:py-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold sm:text-lg">
                      Filters
                    </h2>

                    {activeFilterCount > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-foreground/45 sm:text-sm">
                    Refine your product results
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/60 text-foreground/60 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile content */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6">
                <ProductFilters
                  categories={categories}
                  filters={filters}
                  onChange={setFilters}
                />
              </div>

              {/* Mobile footer */}
              <div className="shrink-0 border-t border-border/70 bg-background/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
                <div className="flex gap-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-12 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground/65 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="h-12 flex-1 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-[0.99]"
                  >
                    Show products
                  </button>
                </div>
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
              className="fixed inset-y-0 left-0 z-[70] hidden w-[min(420px,42vw)] flex-col border-r border-border bg-background/95 shadow-2xl backdrop-blur-2xl md:flex xl:w-[460px] 2xl:w-[500px]"
            >
              {/* Desktop header */}
              <div className="flex h-[5.25rem] shrink-0 items-center justify-between border-b border-border/70 px-6 lg:px-7 xl:px-8">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold xl:text-xl">
                      Filters
                    </h2>

                    {activeFilterCount > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {activeFilterCount} active
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-foreground/45 xl:text-sm">
                    Refine your product results
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/50 text-foreground/60 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Desktop content */}
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 lg:p-7 xl:p-8">
                <ProductFilters
                  categories={categories}
                  filters={filters}
                  onChange={setFilters}
                />
              </div>

              {/* Desktop footer */}
              <div className="shrink-0 border-t border-border/70 bg-background/90 p-5 lg:p-6">
                <div className="flex gap-3">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="h-12 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground/65 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="h-12 flex-1 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:opacity-90 active:scale-[0.99]"
                  >
                    Show products
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}