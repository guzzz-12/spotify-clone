import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabaseMiddleware";

export async function middleware(request: NextRequest) {
  // Permitir el acceso al home page a usuarios no autenticados
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  // Excluir del middleware los endpoints de autenticación
  if (request.nextUrl.pathname.includes("/api/auth")) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ],
}