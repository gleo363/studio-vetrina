import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Imposta cookie referral da parametro URL (?ref=CODICE)
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref) {
    response.cookies.set("vetrina_ref", ref, {
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Proteggi /admin: controlla presenza del cookie di sessione Supabase
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const hasSession = request.cookies.getAll().some(
      (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );
    if (!hasSession) {
      return NextResponse.redirect(new URL("/partner/accedi", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!monitoring|_next/static|_next/image|favicon.ico|icon|apple-icon).*)"],
};
