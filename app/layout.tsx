// app/layout.tsx (ตัวอย่างการแทรกโค้ด)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. เพิ่มบรรทัดนี้เพื่อ Import ตัว Alert
import { Toaster } from "@/components/ui/sonner"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Careequal",
  description: "ระบบสมุดสุขภาพดิจิทัล",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        {children}
        {/* 2. เพิ่มบรรทัดนี้ก่อนปิด body กำหนดให้อยู่มุมขวาล่าง */}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}