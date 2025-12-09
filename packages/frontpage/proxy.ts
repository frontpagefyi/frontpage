import { type NextRequest, NextResponse } from "next/server";
import { signOut, getAuthCookie, refreshSession } from "./lib/auth";
import { exhaustiveCheck } from "./lib/utils";

export async function proxy(request: NextRequest) {
  const cookieJwt = await getAuthCookie();
  if (!cookieJwt) {
    return NextResponse.next();
  }

  // This check is for old cookies that don't have the exp field set
  // Can be removed after a while (when all old cookies are expired)
  if (!cookieJwt.payload.token_exp) {
    console.warn("No token_exp in cookie jwt, signing out");
    await signOut();
    return NextResponse.next();
  }

  if (cookieJwt.payload.token_exp < new Date().getTime() - 500) {
    const result = await refreshSession();

    if (result.success) {
      return NextResponse.next();
    }

    switch (result.error) {
      case "NOT_AUTHENTICATED": {
        // If there's no session somehow, just continue. This probably shouldn't happen as the cookie exists.
        return NextResponse.next();
      }

      case "CONCURRENT_REFRESH_REPLAYED": {
        // Just ignore and continue, another request is already refreshing the token
        return NextResponse.next();
      }

      case "REFRESH_FAILED": {
        // Logout and show error
        console.error("session corrupt, logging out", result);
        await signOut();
        const response = NextResponse.redirect(new URL("/login", request.url), {
          status: 307,
          headers: NextResponse.next().headers,
        });
        return response;
      }
    }

    exhaustiveCheck(result.error, "Unhandled refreshSession error");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
