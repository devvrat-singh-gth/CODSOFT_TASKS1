import { AdminHeader } from "@/components/admin/AdminHeader";

// Reviews in this project are auto-approved on creation (see Review model's
// isApproved default). This page is a placeholder for moderation if you
// later want to flip that default to false and approve manually — the
// backend model already has the isApproved field to support it.
export default function AdminReviewsPage() {
  return (
    <div>
      <AdminHeader title="Reviews" />
      <p className="text-sm text-foreground/50">
        Reviews are currently auto-approved. Wire this page up to a
        <code className="mx-1 rounded bg-muted px-1">GET /api/admin/reviews</code>
        endpoint if you want a moderation queue later.
      </p>
    </div>
  );
}
