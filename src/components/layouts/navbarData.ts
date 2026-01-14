import {
  Archive,
  BarChart3,
  Barcode,
  Bell,
  BellRing,
  Boxes,
  Building2,
  CalendarClock,
  ClipboardList,
  FileText,
  FolderTree,
  Fuel,
  Gift,
  History,
  Landmark,
  LayoutDashboard,
  List,
  LucideIcon,
  PackageMinus,
  PackagePlus,
  Ruler,
  ShieldAlert,
  ShoppingCart,
  TrendingDown,
  Truck,
  Users,
  UserCircle,
  Warehouse,
  Zap,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  roles?: string[]; // Roles that can access this item. If not specified, accessible to all
  warehouses?: string[]; // Warehouse types that can access this item. If not specified, accessible to all warehouses
}

export interface NavbarData {
  navMain: NavItem[];
  projects: NavItem[];
}

export const navbarData: NavbarData = {
  navMain: [
    {
      title: "لوحة التحكم",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "إدارة الموظفين",
      url: "/employees",
      icon: Users,
    },
    {
      title: "إدارة المشتريات",
      url: "/purchases/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "إنشاء طلب شراء",
          url: "/purchases/requests",
          icon: FileText,
        },
        {
          title: "متابعة أوامر الشراء",
          url: "/purchases/orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "إدارة المخزون",
      url: "/inventory/requests",
      icon: Boxes,
      items: [
        {
          title: "إنشاء طلب استعلام",
          url: "/inventory/requests/new",
          icon: FileText,
        },
        {
          title: "متابعة الطلبات",
          url: "/inventory/requests",
          icon: ClipboardList,
        },
        {
          title: "إدارة عهدة المواد",
          url: "/inventory/custody",
          icon: Archive,
        },
      ],
    },
  ],
  projects: [],
};

// Utility function to filter navigation items based on user role and warehouse
export function filterNavItemsByRole(
  items: NavItem[],
  userRole?: string,
  userWarehouse?: string
): NavItem[] {
  // if (!userRole) return []; // If no user role, return empty array

  return items
    .filter((item) => {
      // Check role restrictions
      if (item.roles && item.roles.length > 0) {
        if (!userRole || !item.roles.includes(userRole)) {
          return false;
        }
      }

      // Check warehouse restrictions
      if (item.warehouses && item.warehouses.length > 0) {
        if (!userWarehouse || !item.warehouses.includes(userWarehouse)) {
          return false;
        }
      }

      return true;
    })
    .map((item) => ({
      ...item,
      // Recursively filter subitems if they exist
      items: item.items
        ? filterNavItemsByRole(item.items, userRole, userWarehouse)
        : undefined,
    }));
}

// Utility function to get filtered navbar data based on user role and warehouse
export function getFilteredNavbarData(
  userRole?: string,
  userWarehouse?: string
): NavbarData {
  return {
    navMain: filterNavItemsByRole(navbarData.navMain, userRole, userWarehouse),
    projects: filterNavItemsByRole(
      navbarData.projects,
      userRole,
      userWarehouse
    ),
  };
}

// Utility function to generate route labels from navbar data
export function generateRouteLabels(data: NavbarData): Record<string, string> {
  const labels: Record<string, string> = {};

  // Helper function to extract labels from nav items
  const extractLabels = (items: NavItem[]) => {
    items.forEach((item) => {
      labels[item.url] = item.title.trim();

      // If item has subitems, extract their labels too
      if (item.items) {
        extractLabels(item.items);
      }
    });
  };

  // Extract labels from both navMain and projects
  extractLabels(data.navMain);
  extractLabels(data.projects);

  return labels;
}
