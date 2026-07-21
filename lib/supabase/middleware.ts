import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublicConfig } from "./env";

// Refreshes the auth session on every request and guards the dashboard.
// Adapted from the Supabase Next.js SSR reference, hardened for production:
// this runs in the Edge Runtime on every route, so it must NEVER throw — a
// missing env var or a transient auth error would otherwise 500 the entire
// site (MIDDLEWARE_INVOCATION_FAILED). Instead it fails safe:
//   • public routes  → always pass through
//   • /dashboard     → redirect to /sign-in when auth can't be established

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

/** Send an unauthenticated visitor away from a protected route. */
function redirectToSignIn(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/sign-in";
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If Supabase isn't configured, don't crash — just disable auth. Protected
  // routes still fail closed (redirect), everything public renders normally.
  const config = supabasePublicConfig();
  if (!config) {
    return isProtected(pathname)
      ? redirectToSignIn(request)
      : NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.anonKey, {
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
  });

  // IMPORTANT: getUser() revalidates the token with the auth server; do not
  // insert logic between createServerClient and this call. Wrapped so a
  // transient auth/network error can't take the whole request down.
  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    // Treat an unreachable auth server as "not signed in": fail closed on
    // protected routes, fail open on everything else.
    return isProtected(pathname)
      ? redirectToSignIn(request)
      : NextResponse.next({ request });
  }

  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  if (!user && isProtected(pathname)) {
    return redirectToSignIn(request);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
