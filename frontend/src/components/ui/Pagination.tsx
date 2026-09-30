import { Button } from "./Button";
import { Pagination as PaginationType } from "@/types/product";

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}) {
  if (pagination.pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-foreground/70">
        Page {pagination.page} of {pagination.pages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={pagination.page >= pagination.pages}
        onClick={() => onPageChange(pagination.page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
