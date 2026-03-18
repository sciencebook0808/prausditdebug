"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { DbUser } from "@/lib/types";

export function UsersClient({ users: initial }: { users: DbUser[] }) {
  const [users, setUsers] = useState(initial);

  async function updateRole(userId: number, role: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: role as DbUser["role"] } : u
        )
      );
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-secondary/50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                {u.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                {u.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Select
                  value={u.role}
                  onValueChange={(val) => updateRole(u.id, val)}
                >
                  <SelectTrigger className="h-8 w-32 border-border bg-input text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(u.createdAt), {
                  addSuffix: true,
                })}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-12 text-center text-muted-foreground"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
