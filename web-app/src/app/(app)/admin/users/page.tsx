import { AdminNav } from "@/components/layout/AdminNav";
import { Eyebrow } from "@/components/ui/Badge";
import { UsersClient } from "@/components/admin/UsersClient";
import { getAllUsersForAdmin, ADMIN_USERS_PAGE_SIZE } from "@/lib/data/admin";
import { requireRole } from "@/lib/auth";

export default async function AdminUsersPage() {
  await requireRole("admin");
  const users = await getAllUsersForAdmin({ limit: ADMIN_USERS_PAGE_SIZE });

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/users" />

      <main id="main-content" className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>User management</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          All accounts
        </h1>

        <UsersClient initialUsers={users} hasMore={users.length === ADMIN_USERS_PAGE_SIZE} />
      </main>
    </div>
  );
}
