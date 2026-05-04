import { SignJWT, jwtVerify } from "jose";

export const ADMIN_JWT_COOKIE = "astroai_admin_jwt";

export async function signAdminJwt(): Promise<string> {
  const secret = process.env.ADMIN_DASHBOARD_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_SECRET_MISSING");
  }
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));
}

export async function verifyAdminJwt(token: string | undefined): Promise<boolean> {
  const secret = process.env.ADMIN_DASHBOARD_SECRET?.trim();
  if (!secret || !token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}
