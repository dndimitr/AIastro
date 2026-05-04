import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_JWT_COOKIE, verifyAdminJwt } from "@/lib/admin-auth";

export default async function SecureAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!process.env.ADMIN_DASHBOARD_SECRET?.trim()) {
    redirect("/admin/login?error=config");
  }

  const jar = await cookies();
  const ok = await verifyAdminJwt(jar.get(ADMIN_JWT_COOKIE)?.value);
  if (!ok) {
    redirect("/admin/login?error=auth");
  }

  return <>{children}</>;
}
