import {
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
      title: "إدارة توزيع المواد",
      url: "/law-enforcement/item-assignments",
      icon: PackagePlus,
      warehouses: ["law_enforcement"], // Only accessible to law enforcement warehouse
    },
    {
      title: "إدارة الموظفين",
      url: "/law-enforcement/employees",
      icon: Users,
      warehouses: ["law_enforcement"], // Only accessible to law enforcement warehouse
    },
    {
      title: "الاستعلام عن المخزون",
      url: "/law-enforcement/inventory-stock-requests",
      icon: ClipboardList,
      warehouses: ["law_enforcement"], // Only accessible to law enforcement warehouse
      items: [
        {
          title: "إنشاء طلب استعلام",
          url: "/law-enforcement/inventory-stock-requests",
          icon: ClipboardList,
        },
        {
          title: "الطلبات المرسلة",
          url: "/law-enforcement/stock-requests-list",
          icon: List,
        },
      ],
    },
    {
      title: "طلبات الشراء",
      url: "/law-enforcement/purchase-orders",
      icon: ShoppingCart,
      warehouses: ["law_enforcement"], // Only accessible to law enforcement warehouse
      items: [
        {
          title: "إنشاء طلب شراء",
          url: "/law-enforcement/purchase-requests",
          icon: FileText,
        },
        {
          title: "مراجعة الطلبات",
          url: "/law-enforcement/purchase-orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "عمليات المخازن",
      url: "/warehouse",
      icon: Warehouse,
      warehouses: [
        "furniture",
        "carpet",
        "general",
        "construction",
        "dry",
        "frozen",
        "fuel",
        "consumable",
      ], // Hide from law_enforcement
      items: [
        {
          title: "إدارة المخازن",
          url: "/warehouse/stores",
          icon: Warehouse,
          roles: ["admin"], // Only admin can manage warehouses
        },

        {
          title: "إدخال المواد",
          url: "/warehouse/entry",
          icon: PackagePlus,
        },
        {
          title: "إصدار المواد",
          url: "/warehouse/issuance",
          icon: PackageMinus,
        },

        {
          title: "إدارة المستندات",
          url: "/warehouse/documents",
          icon: BarChart3,
        },
        {
          title: "حركة المواد",
          url: "/warehouse/item-movement",
          icon: History,
        },
        {
          title: "الرصيد المخزني",
          url: "/warehouse/stock-balance",
          icon: Boxes,
        },
        {
          title: "شجرة المواد",
          url: "/tree-items",
          icon: FolderTree,
        },
      ],
    },

    {
      title: "المواد الثابتة",
      url: "/fixed-assets",
      icon: Landmark,
      warehouses: [
        "furniture",
        "carpet",
        "general",
        "construction",
        "consumable",
      ], // Hide from law_enforcement
      items: [
        {
          title: "ترميز",
          url: "/fixed-assets/coding",
          icon: Barcode,
          warehouses: ["furniture", "carpet", "general", "construction"], // Durable goods warehouses
        },
        {
          title: "الذمة",
          url: "/fixed-assets/custody",
          icon: Users,
          warehouses: ["furniture", "carpet", "general"], // Items that can be assigned to people
        },
        {
          title: "المستهلك",
          url: "/fixed-assets/consumed",
          icon: TrendingDown,
          warehouses: ["general", "consumable"], // Consumable items warehouses + general
        },
      ],
    },

    {
      title: "التنبيهات والإشعارات",
      url: "/alerts",
      icon: Bell,
      warehouses: [
        "furniture",
        "carpet",
        "general",
        "construction",
        "dry",
        "frozen",
        "fuel",
        "consumable",
      ], // Hide from law_enforcement
      items: [
        {
          title: "تنبيهات إعادة الطلب",
          url: "/alerts/reorder-alerts",
          icon: BellRing,
        },
        {
          title: "تنبيهات انتهاء الصلاحية",
          url: "/alerts/expiry-alerts",
          icon: CalendarClock,
          warehouses: ["dry", "frozen"], // Only warehouses with perishable items
        },
        {
          title: "تنبيهات انتهاء الضمان",
          url: "/alerts/warranty-alerts",
          icon: ShieldAlert,
          warehouses: ["furniture", "carpet", "general", "construction"], // Only warehouses with warranty items
        },
      ],
    },
    {
      title: "مركز التقارير",
      url: "/reports",
      icon: BarChart3,
      warehouses: [
        "furniture",
        "carpet",
        "general",
        "construction",
        "dry",
        "frozen",
        "fuel",
        "consumable",
      ], // Hide from law_enforcement
    },
  ],
  projects: [
    {
      title: "الأقسام والشعب",
      url: "/settings/departments",
      icon: Building2,
      warehouses: [
        "furniture",
        "carpet",
        "general",
        "construction",
        "dry",
        "frozen",
        "fuel",
        "consumable",
      ], // Hide from law_enforcement
    },
    {
      title: "الموردين",
      url: "/settings/suppliers",
      icon: Truck,
      warehouses: [
        "furniture",
        "carpet",
        "general",
        "construction",
        "dry",
        "frozen",
        "fuel",
        "consumable",
      ], // Hide from law_enforcement
    },
    {
      title: "وحدات القياس",
      url: "/settings/units",
      icon: Ruler,
      warehouses: [
        "furniture",
        "carpet",
        "general",
        "construction",
        "dry",
        "frozen",
        "fuel",
        "consumable",
      ], // Hide from law_enforcement
    },
    {
      title: "المستخدمين",
      url: "/settings/users",
      icon: Users,
      roles: ["admin"],
    },
  ],
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
