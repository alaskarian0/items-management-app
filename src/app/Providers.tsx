"use client"

import React from "react";
import { ThemeProvider } from "@/context/theme-context";
import { SidebarProvider } from "@/context/sidebar-context";
import { Toaster } from "@/components/ui/sonner";
import { db } from "@/lib/db";
import { useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    db.seed().catch(err => console.error("DB Seed Error:", err));
  }, []);

  return (
    <ThemeProvider>
      <SidebarProvider>
        {children}
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  );
}