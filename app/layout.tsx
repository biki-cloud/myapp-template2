import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";

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
      <Navbar />
      <body>{children}</body>
    </html>
  );
}
