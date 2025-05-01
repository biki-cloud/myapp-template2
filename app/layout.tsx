import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My App ",
  description: "My App Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
