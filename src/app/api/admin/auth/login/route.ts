import { ADMIN_JWT_COOKIE, signAdminJwt } from "@/lib/admin-auth";

export const runtime = "nodejs";

function cookieHeader(token: string): string {
  const maxAge = 7 * 24 * 60 * 60;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_JWT_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.ADMIN_DASHBOARD_SECRET?.trim();
    const expected = process.env.ADMIN_DASHBOARD_PASSWORD?.trim();
    if (!secret || !expected) {
      return Response.json(
        {
          error:
            "Админ панелът не е конфигуриран. Задай ADMIN_DASHBOARD_SECRET и ADMIN_DASHBOARD_PASSWORD в .env.local.",
        },
        { status: 503 },
      );
    }

    const body = (await req.json()) as { password?: string };
    if (body.password !== expected) {
      return Response.json({ error: "Невалидна парола." }, { status: 401 });
    }

    const token = await signAdminJwt();
    const res = Response.json({ ok: true });
    res.headers.set("Set-Cookie", cookieHeader(token));
    return res;
  } catch (e) {
    console.error("[admin login]", e);
    return Response.json({ error: "Входът не бе успешен." }, { status: 500 });
  }
}
