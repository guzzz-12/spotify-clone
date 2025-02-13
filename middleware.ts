import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabaseMiddleware";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Permitir el acceso al home page a usuarios no autenticados
  if (path === "/") {
    return NextResponse.next();
  }

  // Excluir el endpoint del cron job de vercel
  if (path === "/api/cron-job") {
    return NextResponse.next();
  }

  // Excluir del middleware los endpoints de autenticación
  if (path.includes("/api/auth") || path.includes("webhook")) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/).*)"
  ],
}