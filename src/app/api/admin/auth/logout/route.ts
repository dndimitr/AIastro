import { ADMIN_JWT_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  const clear = `${ADMIN_JWT_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
  const res = Response.json({ ok: true });
  res.headers.set("Set-Cookie", clear);
  return res;
}
