"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Monitor,
  Moon,
  Sparkles,
  Sun,
  User,
  Warehouse,
  Shield,
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/context/theme-context"
import { useAuthStore } from "@/store/auth/authStore"
import { Badge } from "@/components/ui/badge"

// Warehouse names mapping
const WAREHOUSE_NAMES: Record<string, string> = {
  furniture: "مخزن الأثاث",
  carpet: "مخزن السجاد",
  general: "مخزن المواد العامة",
  construction: "مخزن المواد الإنشائية",
  dry: "مخزن المواد الجافة",
  frozen: "مخزن المواد المجمّدة",
  fuel: "مخزن الوقود",
  consumable: "مخزن المواد المستهلكة",
  law_enforcement: "قسم حفظ النظام",
};

// Role names mapping
const ROLE_NAMES: Record<string, string> = {
  admin: "مدير النظام",
  warehouse_manager: "مدير مخزن",
  department_manager: "مدير قسم",
  employee: "موظف",
};

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth() // Clears localStorage + cookie
    router.push('/login')
  }

  // If no user, don't render anything or show loading state
  if (!user) {
    return null
  }

  const warehouseName = user.warehouse ? WAREHOUSE_NAMES[user.warehouse] || user.warehouse : null;
  const roleName = ROLE_NAMES[user.role] || user.role;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt={user.fullName} />
                <AvatarFallback className="rounded-lg">
                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-medium">{user.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">{user.userName}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[280px] rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={user.fullName} />
                  <AvatarFallback className="rounded-lg">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-right text-sm leading-tight">
                  <span className="truncate font-semibold">{user.fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.userName}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* User Info Section */}
            <div className="px-2 py-2 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">الدور:</span>
                <Badge variant="secondary" className="text-xs">
                  {roleName}
                </Badge>
              </div>

              {warehouseName && (
                <div className="flex items-center gap-2 text-sm">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">المخزن:</span>
                  <span className="text-xs font-medium">{warehouseName}</span>
                </div>
              )}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <ThemeToggle />
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout Button */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme, getThemeIcon, getThemeLabel, mounted } = useTheme()
  
  if (!mounted) {
    return (
      <DropdownMenuItem className="gap-2 p-2">
        <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
          <Sun className="size-4" />
        </div>
        <div className="text-muted-foreground font-medium">المظهر</div>
      </DropdownMenuItem>
    )
  }

  const getIcon = () => {
    const iconType = getThemeIcon()
    if (iconType === "moon") return <Moon className="size-4" />
    if (iconType === "sun") return <Sun className="size-4" />
    return <Monitor className="size-4" />
  }

  return (
    <DropdownMenuItem onClick={toggleTheme} className="gap-2 p-2">
      <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
        {getIcon()}
      </div>
      <div className="text-muted-foreground font-medium">{getThemeLabel()}</div>
    </DropdownMenuItem>
  )
}
