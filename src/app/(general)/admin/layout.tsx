import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { loggedIn, authorized } = await requireRole("admin");

  if (!loggedIn) {
    redirect(`/login?next=${encodeURIComponent("/admin")}`);
  }

  if (!authorized) {
    redirect("/forbidden");
  }

  return children;
}
