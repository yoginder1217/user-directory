import "./globals.css";
import type { Metadata } from "next";
import HeaderWrapper from "@/components/HeaderWrapper";

export const metadata: Metadata = {
  title: "Campus Directory",
  description: "Academic user directory for teachers and students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <HeaderWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
