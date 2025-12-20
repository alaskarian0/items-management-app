"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type BreadcrumbContextType = {
  pageTitle: string | null;
  setPageTitle: (title: string | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [pageTitle, setPageTitle] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}

// Hook to set page title for breadcrumb
export function usePageTitle(title: string) {
  const { setPageTitle } = useBreadcrumb();

  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle(null);
  }, [title, setPageTitle]);
}
