"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const isAdminPath = pathname.startsWith("/admin");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">CD</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline">Campus Directory</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`font-semibold transition-colors ${
              pathname === "/" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`}>
              Directory
            </Link>

            {!isAdminPath && (
              <Link href="/admin/login" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors">
                Admin
              </Link>
            )}

            {isAdminPath && status === "authenticated" && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              Directory
            </Link>
            {!isAdminPath && (
              <Link
                href="/admin/login"
                className="block px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}
            {isAdminPath && status === "authenticated" && (
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 font-semibold text-red-600"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
