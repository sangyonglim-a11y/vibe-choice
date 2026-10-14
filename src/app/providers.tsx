"use client";

import type { PropsWithChildren } from "react";
import { AuthProvider, NicknameGate } from "@/features/auth";

export function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <NicknameGate>{children}</NicknameGate>
    </AuthProvider>
  );
}
