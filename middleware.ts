import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // アプリケーションのベースURLをヘッダーに追加
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-base-url", request.nextUrl.origin);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
