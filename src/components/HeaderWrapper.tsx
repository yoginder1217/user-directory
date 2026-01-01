"use client";

import { SessionProvider } from "next-auth/react";
import Header from "./Header";

export default function HeaderWrapper() {
  return (
    <SessionProvider basePath="/api/auth">
      <Header />
    </SessionProvider>
  );
}
