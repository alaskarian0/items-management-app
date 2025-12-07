import {
  LucideIcon,
  LayoutDashboard,
  Warehouse,
  PackagePlus,
  PackageMinus,
  Boxes,
  History,
  Landmark,
  Barcode,
  Users,
  Building2,
  Truck,
  Ruler,
  FileArchive,
  Settings,
  FileText,
  Bell,
  Package,
  ClipboardList,
  Zap,
  UserCircle,
  TrendingDown,
  Gift,
  BarChart3,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  roles?: string[]; // Roles that can access this item. If not specified, accessible to all
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
      title: "عمليات المخازن",
      url: "/warehouse",
      icon: Warehouse,
      items: [
        {
          title: "إدارة المخازن",
          url: "/settings/stores",
          icon: Warehouse,
        },
        {
          title: "إدخال المواد",
          url: "/warehouse/entry/new",
          icon: PackagePlus,
        },
        {
          title: "إصدار المواد",
          url: "/warehouse/issuance/new",
          icon: PackageMinus,
        },
        {
          title: "الرصيد المخزني",
          url: "/warehouse/stock-balance",
          icon: Boxes,
        },
        {
          title: "رصيد الأقسام",
          url: "/warehouse/department-balance",
          icon: Building2,
        },
      ],
    },
    {
      title: "الإدخال المباشر",
      url: "/direct-entry",
      icon: Zap,
      items: [
        {
          title: "إدخال سريع",
          url: "/new",
          icon: PackagePlus,
        },
        {
          title: "جرد الأقسام",
          url: "/department-inventory",
          icon: ClipboardList,
        },
      ],
    },
    {
      title: "الموجودات الثابتة",
      url: "/fixed-assets",
      icon: Landmark,
      items: [
        {
          title: "ترميز",
          url: "/fixed-assets/coding",
          icon: Barcode,
        },
        {
          title: "الذمة",
          url: "/fixed-assets/custody",
          icon: Users,
        },
        {
          title: "المستهلك",
          url: "/fixed-assets/consumed",
          icon: TrendingDown,
        },
        {
          title: "الممنوح",
          url: "/fixed-assets/donated",
          icon: Gift,
        },
      ],
    },
    {
      title: "إدارة المواد",
      url: "/materials",
      icon: Package,
      items: [
        {
          title: "شجرة المواد",
          url: "/items",
          icon: Boxes,
        },
        {
          title: "الذمة",
          url: "/custody",
          icon: ClipboardList,
        },
        {
          title: "حركة المواد",
          url: "/item-movement",
          icon: History,
        },
      ]
    },
    {
      title: "التقارير",
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "الأرشيف",
      url: "/archive",
      icon: FileArchive,
    },
  ],
  projects: [
    {
      title: "الإعدادات",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "الأقسام",
          url: "/settings/departments",
          icon: Building2,
        },
        {
          title: "الموردين",
          url: "/settings/suppliers",
          icon: Truck,
        },
        {
          title: "وحدات القياس",
          url: "/settings/units",
          icon: Ruler,
        },
        {
          title: "المستخدمين",
          url: "/settings/users",
          icon: Users,
          roles: ["admin"],
        },
      ],
    },
  ],
};

// Utility function to filter navigation items based on user role
export function filterNavItemsByRole(items: NavItem[], userRole?: string): NavItem[] {
  if (!userRole) return []; // If no user role, return empty array
  
  return items
    .filter(item => {
      // If no roles specified, item is accessible to all authenticated users
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      // Check if user's role is in the allowed roles
      return item.roles.includes(userRole);
    })
    .map(item => ({
      ...item,
      // Recursively filter subitems if they exist
      items: item.items ? filterNavItemsByRole(item.items, userRole) : undefined
    }));
}

// Utility function to get filtered navbar data based on user role
export function getFilteredNavbarData(userRole?: string): NavbarData {
  return {
    navMain: filterNavItemsByRole(navbarData.navMain, userRole),
    projects: filterNavItemsByRole(navbarData.projects, userRole),
  };
}

// Utility function to generate route labels from navbar data
export function generateRouteLabels(data: NavbarData): Record<string, string> {
  const labels: Record<string, string> = {};
  
  // Helper function to extract labels from nav items
  const extractLabels = (items: NavItem[]) => {
    items.forEach(item => {
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