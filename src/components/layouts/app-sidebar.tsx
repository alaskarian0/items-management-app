"use client";

import {
  Warehouse,
} from "lucide-react";
import * as React from "react";

import { NavGroup } from "@/components/layouts/NavGroup";
import { NavUser } from "@/components/layouts/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth/authStore";
import { getFilteredNavbarData } from "./navbarData";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  // Get filtered navigation data based on user role and warehouse
  const filteredNavData = React.useMemo(() => {
    return getFilteredNavbarData(user?.role, user?.warehouse);
  }, [user?.role, user?.warehouse]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Warehouse className="size-4" />
          </div>
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-semibold">نظام إدارة المخزون</span>
            <span className="truncate text-xs">Inventory Management</span>
          </div>
          {/* <ChevronsUpDown className="ml-auto" /> */}
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup items={filteredNavData.navMain} groupLabel="الرئيسية" />
        {user?.warehouse !== "law_enforcement" && (
          <NavGroup items={filteredNavData.projects} groupLabel="اعدادات النظام" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
