import { test, expect } from "@playwright/test";

// トップページのタイトル表示を確認するe2eテスト

test("トップページのタイトルが正しく表示される", async ({ page }) => {
  await page.goto("/");
});
