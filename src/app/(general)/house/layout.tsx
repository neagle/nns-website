import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function HouseLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { loggedIn, authorized } = await requireRole("house");

  if (!loggedIn) {
    redirect(`/login?next=${encodeURIComponent("/house")}`);
  }

  if (!authorized) {
    redirect("/forbidden");
  }

  return children;
}
