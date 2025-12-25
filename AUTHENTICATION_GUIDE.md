# Authentication & Access Control Guide

## Overview

This inventory management system implements a dual-layer access control system based on:
1. **User Roles** (admin, warehouse_manager)
2. **Warehouse Types** (8 different warehouse categories)

## Warehouse Types & Users

### Available Warehouses

| Warehouse ID | Warehouse Name (Arabic) | Username | Password |
|-------------|------------------------|----------|----------|
| `furniture` | مخزن الأثاث والممتلكات العامة | furniture_admin | furniture123 |
| `carpet` | مخزن السجاد والمفروشات | carpet_admin | carpet123 |
| `general` | مخزن المواد العامة | general_admin | general123 |
| `construction` | مخزن المواد الإنشائية | construction_admin | construction123 |
| `dry` | مخزن المواد الجافة | dry_admin | dry123 |
| `frozen` | مخزن المواد المجمّدة | frozen_admin | frozen123 |
| `fuel` | مخزن الوقود والزيوت | fuel_admin | fuel123 |
| `consumable` | مخزن المواد المستهلكة | consumable_admin | consumable123 |
| `law_enforcement` | مخزن قسم حفظ النظام | law_enforcement_admin | law123 |

### Warehouse Categories

Warehouses are grouped into logical categories:

#### **Durable Goods Warehouses**
- Furniture (الأثاث)
- Carpet (السجاد)
- General Materials (المواد العامة)
- Construction Materials (المواد الإنشائية)

#### **Consumable Warehouses**
- Dry Materials (المواد الجافة)
- Frozen Materials (المواد المجمّدة)
- Fuel & Oils (الوقود والزيوت)
- Consumable Materials (المواد المستهلكة)

#### **Special Distribution Warehouse**
- Law Enforcement Department (قسم حفظ النظام)
  - Receives materials from general warehouses
  - Assigns items to departments, divisions, units, and personnel
  - Handles both fixed assets and consumable materials
  - Documents item assignments officially

## User Roles

### 1. Admin
- **Full system access**
- Can manage all warehouses
- Can create/manage users
- Access to all features

### 2. Warehouse Manager
- **Warehouse-specific access**
- Can only access features relevant to their warehouse type
- Cannot manage other warehouses
- Cannot manage users

## Page Access Matrix

### ✅ Pages Accessible to ALL Warehouses (Except Law Enforcement)

| Page | URL | Description |
|------|-----|-------------|
| لوحة التحكم | `/` | Dashboard |
| إدخال المواد | `/warehouse/entry` | Material Entry |
| إصدار المواد | `/warehouse/issuance` | Material Issuance |
| إدارة المستندات | `/warehouse/documents` | Document Management |
| حركة المواد | `/warehouse/item-movement` | Material Movement |
| الرصيد المخزني | `/warehouse/stock-balance` | Stock Balance |
| تنبيهات إعادة الطلب | `/alerts/reorder-alerts` | Reorder Alerts |
| إدخال سريع | `/direct-entry/new` | Quick Entry |
| شجرة المواد | `/direct-entry/items` | Item Tree |
| مركز التقارير | `/reports` | Reports Center |
| الأقسام والشعب | `/settings/departments` | Departments |
| الموردين | `/settings/suppliers` | Suppliers |
| وحدات القياس | `/settings/units` | Units |

### 🔐 Role-Restricted Pages (Admin Only)

| Page | URL | Access |
|------|-----|--------|
| إدارة المخازن | `/warehouse/stores` | Admin only |
| المستخدمين | `/settings/users` | Admin only |

### 🚔 Law Enforcement Warehouse Pages (Special Distribution)

**URL:** `/law-enforcement/item-assignments`
**Access:** Law Enforcement warehouse only

The Law Enforcement warehouse has **restricted access** and can only see:
- ✅ Dashboard (لوحة التحكم) - `/`
- ✅ Item Assignments Management (إدارة توزيع المواد) - `/law-enforcement/item-assignments`

**All other pages are hidden** from this warehouse type.

**Functionality:**
- View items received from general warehouses
- Assign items to:
  - Department (القسم)
  - Division (الشعبة)
  - Unit (الوحدة)
  - Recipient Name and Position (اسم المستلم والمنصب)
- Handle both fixed assets and consumable materials
- Document all assignments with notes
- Track assignment status (pending/assigned)

### 📦 Warehouse-Specific Pages

#### Fixed Assets - Coding (ترميز)
**URL:** `/fixed-assets/coding`
**Access:** Durable goods warehouses only
- ✅ Furniture
- ✅ Carpet
- ✅ General
- ✅ Construction

---

#### Fixed Assets - Custody (الذمة)
**URL:** `/fixed-assets/custody`
**Access:** Assignable items warehouses
- ✅ Furniture
- ✅ Carpet
- ✅ General

---

#### Fixed Assets - Consumed (المستهلك)
**URL:** `/fixed-assets/consumed`
**Access:** Consumable warehouses
- ✅ Dry
- ✅ Frozen
- ✅ Fuel
- ✅ Consumable

---

#### Expiry Alerts (تنبيهات انتهاء الصلاحية)
**URL:** `/alerts/expiry-alerts`
**Access:** Perishable items warehouses
- ✅ Dry
- ✅ Frozen

---

#### Warranty Alerts (تنبيهات انتهاء الضمان)
**URL:** `/alerts/warranty-alerts`
**Access:** Warranty-eligible items warehouses
- ✅ Furniture
- ✅ Carpet
- ✅ General
- ✅ Construction

## Complete Access Matrix by Warehouse

### Furniture Warehouse (مخزن الأثاث)
```
✅ All common warehouse operations
✅ Warranty Alerts
✅ Fixed Assets - Coding
✅ Fixed Assets - Custody
❌ Expiry Alerts
❌ Fixed Assets - Consumed
```

### Carpet Warehouse (مخزن السجاد)
```
✅ All common warehouse operations
✅ Warranty Alerts
✅ Fixed Assets - Coding
✅ Fixed Assets - Custody
❌ Expiry Alerts
❌ Fixed Assets - Consumed
```

### General Materials Warehouse (مخزن المواد العامة)
```
✅ All common warehouse operations
✅ Warranty Alerts
✅ Fixed Assets - Coding
✅ Fixed Assets - Custody
❌ Expiry Alerts
❌ Fixed Assets - Consumed
```

### Construction Materials Warehouse (مخزن المواد الإنشائية)
```
✅ All common warehouse operations
✅ Warranty Alerts
✅ Fixed Assets - Coding
❌ Fixed Assets - Custody
❌ Expiry Alerts
❌ Fixed Assets - Consumed
```

### Dry Materials Warehouse (مخزن المواد الجافة)
```
✅ All common warehouse operations
✅ Expiry Alerts
✅ Fixed Assets - Consumed
❌ Warranty Alerts
❌ Fixed Assets - Coding
❌ Fixed Assets - Custody
```

### Frozen Materials Warehouse (مخزن المواد المجمّدة)
```
✅ All common warehouse operations
✅ Expiry Alerts
✅ Fixed Assets - Consumed
❌ Warranty Alerts
❌ Fixed Assets - Coding
❌ Fixed Assets - Custody
```

### Fuel & Oils Warehouse (مخزن الوقود والزيوت)
```
✅ All common warehouse operations
✅ Fixed Assets - Consumed
❌ Warranty Alerts
❌ Expiry Alerts
❌ Fixed Assets - Coding
❌ Fixed Assets - Custody
```

### Consumable Materials Warehouse (مخزن المواد المستهلكة)
```
✅ All common warehouse operations
✅ Fixed Assets - Consumed
❌ Warranty Alerts
❌ Expiry Alerts
❌ Fixed Assets - Coding
❌ Fixed Assets - Custody
```

### Law Enforcement Warehouse (مخزن قسم حفظ النظام)
```
✅ Dashboard
✅ Item Assignments Management (Special page for distributing items)
❌ All warehouse operations (entry, issuance, documents, etc.)
❌ All alerts and notifications
❌ Direct entry pages
❌ Fixed assets pages
❌ Reports center
❌ Settings pages (departments, suppliers, units)
```
**Special Role:** This warehouse acts as a distribution center for items received from other warehouses.

## How It Works

### 1. Authentication Flow

```typescript
// User selects warehouse from dropdown
// → Auto-fills username and password
// → Creates dummy user with warehouse field
const dummyUser: User = {
  id: 1,
  userName: "furniture_admin",
  fullName: "مسؤول مخزن الأثاث والممتلكات العامة",
  role: "warehouse_manager",
  warehouse: "furniture", // ← Warehouse type
  isTempPass: false,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};
```

### 2. Access Control Implementation

#### NavItem Interface
```typescript
interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  roles?: string[];        // Role-based restriction
  warehouses?: string[];   // Warehouse-based restriction
  items?: NavItem[];
}
```

#### Filtering Logic
```typescript
// Checks both role AND warehouse restrictions
function filterNavItemsByRole(
  items: NavItem[],
  userRole?: string,
  userWarehouse?: string
): NavItem[] {
  return items.filter((item) => {
    // Check role restrictions
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }

    // Check warehouse restrictions
    if (item.warehouses && !item.warehouses.includes(userWarehouse)) {
      return false;
    }

    return true;
  });
}
```

### 3. Middleware Protection

```typescript
// src/middleware.ts
export default function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isPublicRoute = ['/login', '/register'].includes(pathname);

  // Redirect to login if no token and accessing protected route
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if has token and accessing auth pages
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
```

## Key Files

| File | Purpose |
|------|---------|
| `src/store/auth/authTypes.ts:8` | User interface with `warehouse` field |
| `src/app/(auth)/login/page.tsx` | Login page with warehouse selector |
| `src/components/layouts/navbarData.ts` | Navigation structure with access rules |
| `src/components/layouts/app-sidebar.tsx` | Sidebar with filtered navigation |
| `src/middleware.ts` | Route protection middleware |
| `src/lib/mock-db.ts` | Mock database with warehouse users |

## Testing Access Control

### Test Scenario 1: Furniture Warehouse
```bash
1. Login as: furniture_admin / furniture123
2. Expected visible pages:
   ✅ Dashboard
   ✅ Warehouse Operations (except Management)
   ✅ Warranty Alerts
   ✅ Fixed Assets - Coding
   ✅ Fixed Assets - Custody
   ❌ Expiry Alerts (hidden)
   ❌ Fixed Assets - Consumed (hidden)
```

### Test Scenario 2: Frozen Warehouse
```bash
1. Login as: frozen_admin / frozen123
2. Expected visible pages:
   ✅ Dashboard
   ✅ Warehouse Operations (except Management)
   ✅ Expiry Alerts
   ✅ Fixed Assets - Consumed
   ❌ Warranty Alerts (hidden)
   ❌ Fixed Assets - Coding (hidden)
   ❌ Fixed Assets - Custody (hidden)
```

### Test Scenario 3: Law Enforcement Warehouse
```bash
1. Login as: law_enforcement_admin / law123
2. Expected visible pages:
   ✅ Dashboard (لوحة التحكم)
   ✅ Item Assignments Management (إدارة توزيع المواد)
   ❌ All other pages (hidden)
3. Test functionality:
   - View received items from other warehouses
   - Assign items to departments/divisions/personnel
   - Track assignment status
```

### Test Scenario 4: Navigation Filtering
```bash
# Check sidebar dynamically filters based on logged-in user
1. Login as different warehouse types
2. Observe sidebar menu changes
3. Verify restricted pages don't appear
4. Check dropdown menus show only allowed items
```

## Security Notes

⚠️ **Current Implementation:**
- Uses **dummy authentication** for development
- Token: `dummy_token_[warehouse]_[timestamp]`
- No real API validation

🔒 **Production Requirements:**
- Replace dummy auth with real JWT tokens
- Implement server-side permission checks
- Add database-backed user management
- Hash passwords properly
- Validate tokens on every request
- Add role/warehouse verification in API routes

## Logout Functionality

Users can logout from the sidebar:
1. Click on user avatar in sidebar footer
2. Select "تسجيل خروج" (Logout)
3. Clears authentication (localStorage + cookies)
4. Redirects to `/login`

## Summary

This system provides **granular access control** that considers:
- ✅ User authentication (login required)
- ✅ Role-based permissions (admin vs warehouse_manager)
- ✅ Warehouse-type restrictions (relevant features per warehouse)
- ✅ Dynamic sidebar filtering
- ✅ Route protection via middleware

Each warehouse sees only the features relevant to their type of inventory, improving UX and preventing access to irrelevant functionality.
