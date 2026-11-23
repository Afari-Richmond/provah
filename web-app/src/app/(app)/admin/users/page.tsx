import { AdminNav } from "@/components/layout/AdminNav";
import { Eyebrow } from "@/components/ui/Badge";
import { UsersClient } from "@/components/admin/UsersClient";
import { getAllUsersForAdmin } from "@/lib/data/admin";

export default async function AdminUsersPage() {
  const users = await getAllUsersForAdmin();

  return (
    <div className="min-h-screen bg-white">
      <AdminNav active="/admin/users" />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
        <Eyebrow>User management</Eyebrow>
        <h1 className="mt-3 font-(family-name:--font-unbounded) text-[32px] font-bold leading-tight text-[var(--color-ink)]">
          All accounts
        </h1>

        <UsersClient initialUsers={users} />
      </main>
    </div>
  );
}
