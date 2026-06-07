import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  const response = NextResponse.next();

  if (ref) {
    response.cookies.set("vetrina_ref", ref, {
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
