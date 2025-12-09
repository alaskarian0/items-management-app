import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./Providers";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "نظام إدارة المخزون | Inventory Management System",
  description: "نظام متكامل لإدارة المخزون والموجودات الثابتة - Comprehensive inventory and fixed assets management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body dir="rtl"
        className={`${cairo.variable} antialiased`}
        style={{ fontFamily: 'var(--font-cairo), Cairo, system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
