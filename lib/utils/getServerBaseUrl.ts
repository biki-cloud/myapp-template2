import { headers } from "next/headers";

/**
 * サーバーサイドでベースURLを取得します
 */
export function getServerBaseUrl(): string {
  try {
    const headersList = headers();
    const baseUrl = headersList.get("x-base-url");
    if (baseUrl) return baseUrl;

    // 開発環境
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }

    // 本番環境
    return process.env.NEXT_PUBLIC_APP_URL || "";
  } catch {
    // ヘッダーが利用できない場合のフォールバック
    return process.env.NEXT_PUBLIC_APP_URL || "";
  }
}

/**
 * サーバーサイドで相対パスを絶対URLに変換します
 */
export function createServerAbsoluteUrl(path: string): string {
  const baseUrl = getServerBaseUrl();
  if (!baseUrl) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
