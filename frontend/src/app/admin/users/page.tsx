"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { User } from "@/types/user";
import api from "@/services/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<(User & { _id: string; isActive: boolean })[]>([]);

  const load = () =>
    api.get("/admin/users", { params: { limit: 50 } }).then((res) => setUsers(res.data.data.users));
  useEffect(() => {
    load();
  }, []);

  const toggleActive = async (user: { _id: string; isActive: boolean }) => {
    try {
      await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
      toast.success("User status updated");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update user");
    }
  };

  return (
    <div>
      <AdminHeader title="Users" />
      <DataTable
        rows={users}
        columns={[
          { header: "Name", render: (u) => u.name },
          { header: "Email", render: (u) => u.email },
          { header: "Role", render: (u) => <Badge>{u.role}</Badge> },
          { header: "Status", render: (u) => (u.isActive ? "Active" : "Deactivated") },
          {
            header: "Actions",
            render: (u) => (
              <button onClick={() => toggleActive(u)} className="text-xs underline">
                {u.isActive ? "Deactivate" : "Activate"}
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}
