import { Button } from "./Button";
import { Pagination as PaginationType } from "@/types/product";

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}) {
  if (pagination.pages <= 1) {
    return null;
  }

  const pages: number[] = [];

  for (
    let i = 1;
    i <= pagination.pages;
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page === 1}
        onClick={() =>
          onPageChange(
            pagination.page - 1
          )
        }
      >
        Previous
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={
            page === pagination.page
              ? "primary"
              : "outline"
          }
          onClick={() =>
            onPageChange(page)
          }
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={
          pagination.page >=
          pagination.pages
        }
        onClick={() =>
          onPageChange(
            pagination.page + 1
          )
        }
      >
        Next
      </Button>
    </div>
  );
}