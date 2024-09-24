import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/utils/supabaseServerClient";

/** Callback para verificar la autenticación social */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code");

  if (code) {
    const supabase = await supabaseServerClient();
    const {error} = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL("/signin",request.url));
    }

    const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer

    const isLocalEnv = process.env.NODE_ENV === "development";

    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(origin);

    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}`);

    } else {
      return NextResponse.redirect(origin);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL("/signin",request.url));
}