/**
 * 現在の環境に応じたベースURLを取得します
 * - 本番環境: https://your-project.vercel.app
 * - プレビュー環境: https://your-project-preview.vercel.app
 * - 開発環境: http://localhost:3000
 */
export function getBaseUrl(): string {
  // クライアントサイドの場合
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Vercel本番/プレビュー環境の場合
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 開発環境の場合
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/**
 * 相対パスを絶対URLに変換します
 * @param path - 相対パス（例: "/api/auth"）
 * @returns 絶対URL
 */
export function createAbsoluteUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * URLが有効かどうかを確認します
 * @param url - 確認するURL
 * @returns 有効な場合はtrue、無効な場合はfalse
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
