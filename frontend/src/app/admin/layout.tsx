import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Container } from "@/components/layout/Container";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <Container className="flex gap-8 py-8">
        <AdminSidebar />
        <div className="flex-1">{children}</div>
      </Container>
    </ProtectedRoute>
  );
}
