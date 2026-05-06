import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "./config";
import { isAllowedOsEmail } from "@/lib/os/users";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/os/login";
  const isAuthRoute = pathname.startsWith("/os/auth");
  const config = getSupabaseConfig();

  if (!config) {
    if (!isLogin && !isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/os/login";
      url.search = "?error=config";
      return NextResponse.redirect(url);
    }

    return response;
  }

  const supabase = createServerClient(
    config.url,
    config.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not insert code between createServerClient and getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isLogin && !isAuthRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/os/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    if (user.email && isAllowedOsEmail(user.email)) {
      const url = request.nextUrl.clone();
      url.pathname = "/os";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
