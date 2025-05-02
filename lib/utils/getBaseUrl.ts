import { headers } from "next/headers";

/**
 * 現在の環境に応じたベースURLを取得します
 * - 本番環境: https://your-project.vercel.app
 * - プレビュー環境: https://your-project-preview.vercel.app
 * - 開発環境: http://localhost:3000
 */
export function getBaseUrl(): string {
  try {
    // サーバーサイドでの実行時
    const headersList = headers();
    const baseUrl = headersList.get("x-base-url");
    if (baseUrl) return baseUrl;

    // クライアントサイドでの実行時
    if (typeof window !== "undefined") {
      return window.location.origin;
    }

    // フォールバック（開発環境）
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }

    // フォールバック（本番環境）
    return process.env.NEXT_PUBLIC_APP_URL || "";
  } catch {
    // ヘッダーが利用できない場合のフォールバック
    return process.env.NEXT_PUBLIC_APP_URL || "";
  }
}

/**
 * 相対パスを絶対URLに変換します
 * @param path - 相対パス（例: "/api/auth"）
 * @returns 絶対URL
 */
export function createAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return path; // ベースURLが取得できない場合は相対パスをそのまま返す

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * URLが有効かどうかを確認します
 * @param url - 確認するURL
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
