"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Warehouse as WarehouseIcon,
  Building2,
  Layers,
  Search,
  Package,
  Filter,
  Loader2,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Import shared data and types
import { type Warehouse } from "@/lib/types/warehouse";
import { usePageTitle } from "@/context/breadcrumb-context";
import { useWarehouses } from "@/hooks/use-warehouses";
import { useDepartments } from "@/hooks/use-departments";
import { useDivisions } from "@/hooks/use-divisions";
import { useUnits } from "@/hooks/use-units";

// --- MODAL STATE TYPE ---
type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  data?: { id: number; name: string; parentId?: number };
};

// --- RECURSIVE WAREHOUSE NODE COMPONENT ---
const WarehouseNode = ({
  warehouse,
  onOpenModal,
  onDelete,
  onSelect,
  selectedId,
  level = 0,
  searchTerm = '',
}: {
  warehouse: Warehouse;
  onOpenModal: (mode: 'add' | 'edit', data: any) => void;
  onDelete: (id: number) => void;
  onSelect: (warehouse: Warehouse) => void;
  selectedId: number | null;
  level?: number;
  searchTerm?: string;
}) => {
  const [isOpen, setIsOpen] = useState(level < 2);

  // Check if this warehouse or any child matches search
  const matchesSearch = (wh: Warehouse, term: string): boolean => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    if (wh.name.toLowerCase().includes(lowerTerm)) return true;
    return !!(wh.children && wh.children.length > 0 && wh.children.some(child => matchesSearch(child, term)));
  };

  const isVisible = matchesSearch(warehouse, searchTerm);
  const isHighlighted = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm;

  if (!isVisible) return null;

  const getLevelColor = (level: number) => {
    const colors = [
      'text-blue-600 bg-blue-50 dark:bg-blue-950',
      'text-green-600 bg-green-50 dark:bg-green-950',
      'text-purple-600 bg-purple-50 dark:bg-purple-950',
    ];
    return colors[level] || colors[2];
  };

  const getLevelBadge = (level: number) => {
    const badges = ['رئيسي', 'فرعي', 'ثانوي'];
    return badges[level] || 'ثانوي';
  };

  const isSelected = warehouse.id === selectedId;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pr-2 mt-1">
      <div className={`flex items-center gap-2 group mb-0.5 rounded-lg p-2 transition-all border ${
        isSelected ? 'bg-primary/10 border-primary' : isHighlighted ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border hover:bg-muted/50'
      }`}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            disabled={!warehouse.children || warehouse.children.length === 0}
          >
            {warehouse.children && warehouse.children.length > 0 ? (
              isOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )
            ) : (
              <div className="w-3.5 h-3.5" />
            )}
          </Button>
        </CollapsibleTrigger>

        <div className={`p-1.5 rounded-md ${getLevelColor(level)}`}>
          <WarehouseIcon className="h-3.5 w-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onSelect(warehouse)}
              className={`font-semibold text-sm truncate hover:text-primary cursor-pointer ${isHighlighted || isSelected ? 'text-primary' : ''}`}
            >
              {warehouse.name}
            </button>
            <Badge variant="outline" className="text-xs h-5">
              {getLevelBadge(level)}
            </Badge>
            {warehouse.children && warehouse.children.length > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {warehouse.children.length} فرع
              </Badge>
            )}
            {warehouse.itemCount !== undefined && (
              <Badge variant="default" className="text-xs h-5 bg-blue-600">
                <Package className="h-3 w-3 ml-1" />
                {warehouse.itemCount.toLocaleString()} صنف
              </Badge>
            )}
            {warehouse.departmentName && (
              <Badge variant="outline" className="text-xs h-5 bg-green-50 text-green-700 border-green-200">
                {warehouse.departmentName}
              </Badge>
            )}
            {warehouse.divisionName && (
              <Badge variant="outline" className="text-xs h-5 bg-purple-50 text-purple-700 border-purple-200">
                {warehouse.divisionName}
              </Badge>
            )}
            {warehouse.unitName && (
              <Badge variant="outline" className="text-xs h-5 bg-orange-50 text-orange-700 border-orange-200">
                {warehouse.unitName}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onOpenModal('add', { parentId: warehouse.id })}
            title="إضافة مخزن فرعي"
          >
            <PlusCircle className="h-3.5 w-3.5 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onOpenModal('edit', warehouse)}
            title="تعديل"
          >
            <Edit className="h-3.5 w-3.5 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDelete(warehouse.id)}
            title="حذف"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </Button>
        </div>
      </div>

      {warehouse.children && warehouse.children.length > 0 && (
        <CollapsibleContent className="pr-4 border-r-2 border-dashed border-muted-foreground/20 mr-3">
          {warehouse.children.map((child) => (
            <WarehouseNode
              key={child.id}
              warehouse={child}
              onOpenModal={onOpenModal}
              onDelete={onDelete}
              onSelect={onSelect}
              selectedId={selectedId}
              level={level + 1}
              searchTerm={searchTerm}
            />
          ))}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

const ManageWarehousesPage = () => {
  usePageTitle("إدارة المخازن");

  const {
    warehouses: warehousesData,
    loading,
    error,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse: removeWarehouse
  } = useWarehouses();

  // Fetch departments, divisions, and units from API
  const { departments: departmentsData } = useDepartments();
  const { divisions: divisionsData } = useDivisions();
  const { units: unitsData } = useUnits();

  // Memoize API data arrays to prevent re-creating on every render
  const apiDepartments = useMemo(() => departmentsData?.data || [], [departmentsData?.data]);
  const apiDivisions = useMemo(() => divisionsData?.data || [], [divisionsData?.data]);
  const apiUnits = useMemo(() => unitsData?.data || [], [unitsData?.data]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'add' });
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    departmentId: 0,
    departmentName: '',
    divisionId: 0,
    divisionName: '',
    unitId: 0,
    unitName: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterDivision, setFilterDivision] = useState<string>('all');
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

  // Memoize enriched warehouses to prevent infinite loops
  const warehouses = useMemo(() => {
    if (!warehousesData?.data) return [];

    let warehousesList: Warehouse[] = [];

    // Handle different response formats
    if (Array.isArray(warehousesData.data)) {
      warehousesList = warehousesData.data;
    } else if ('items' in warehousesData.data) {
      warehousesList = warehousesData.data.items;
    } else {
      warehousesList = [warehousesData.data as Warehouse];
    }

    // Enrich warehouses with department/division/unit names
    const enrichWarehouses = (warehouses: Warehouse[]): Warehouse[] => {
      return warehouses.map((wh: any) => {
        const dept = apiDepartments.find((d: any) => d.id === wh.departmentId);
        const div = apiDivisions.find((d: any) => d.id === wh.divisionId);
        const unit = apiUnits.find((u: any) => u.id === wh.unitId);

        // Map subWarehouses from API to children for UI
        const children = wh.subWarehouses || wh.children;

        return {
          ...wh,
          departmentName: dept?.name,
          divisionName: div?.name,
          unitName: unit?.name,
          children: children && children.length > 0 ? enrichWarehouses(children) : undefined,
        };
      });
    };

    return enrichWarehouses(warehousesList);
  }, [warehousesData, apiDepartments, apiDivisions, apiUnits]);

  // Calculate statistics
  const stats = useMemo(() => {
    const countWarehouses = (nodes: Warehouse[]): {
      total: number;
      main: number;
      sub: number;
      depth: number;
      totalItems: number;
    } => {
      let total = 0;
      const main = nodes.length;
      let sub = 0;
      let maxDepth = 0;
      let totalItems = 0;

      const traverse = (node: Warehouse, depth: number) => {
        total++;
        if (depth > 0) sub++;
        if (node.itemCount) totalItems += node.itemCount;
        maxDepth = Math.max(maxDepth, depth);
        if (node.children && node.children.length > 0) {
          node.children.forEach((child) => traverse(child, depth + 1));
        }
      };

      nodes.forEach((node) => traverse(node, 0));

      return { total, main, sub, depth: maxDepth + 1, totalItems };
    };

    return countWarehouses(warehouses);
  }, [warehouses]);

  // Filter warehouses by level, department, division, and unit
  const filteredWarehouses = useMemo(() => {
    let result = warehouses;

    // Apply department/division/unit filters
    const applyOrgFilters = (nodes: Warehouse[]): Warehouse[] => {
      return nodes.filter(node => {
        let matches = true;

        if (filterDepartment !== 'all') {
          matches = matches && node.departmentId?.toString() === filterDepartment;
        }
        if (filterDivision !== 'all') {
          matches = matches && node.divisionId?.toString() === filterDivision;
        }
        if (filterUnit !== 'all') {
          matches = matches && node.unitId?.toString() === filterUnit;
        }

        return matches;
      }).map(node => ({
        ...node,
        children: node.children ? applyOrgFilters(node.children) : []
      }));
    };

    // Apply organizational filters first
    if (filterDepartment !== 'all' || filterDivision !== 'all' || filterUnit !== 'all') {
      result = applyOrgFilters(result);
    }

    // Then apply level filter
    if (filterLevel === 'all') return result;

    const filterByLevel = (nodes: Warehouse[], currentLevel: number, targetLevel: number): Warehouse[] => {
      if (currentLevel === targetLevel) return nodes;

      return nodes.flatMap(node =>
        filterByLevel(node.children || [], currentLevel + 1, targetLevel)
      );
    };

    const levelMap: Record<string, number> = {
      'main': 0,
      'sub': 1,
      'subsub': 2,
    };

    const targetLevel = levelMap[filterLevel];
    if (targetLevel === 0) {
      return result;
    }

    // For sub-warehouses, show them in a flat structure
    const flatResult: Warehouse[] = [];
    const collectLevel = (nodes: Warehouse[], currentLevel: number) => {
      nodes.forEach(node => {
        if (currentLevel === targetLevel) {
          flatResult.push(node);
        }
        if (node.children && node.children.length > 0) {
          collectLevel(node.children, currentLevel + 1);
        }
      });
    };

    collectLevel(result, 0);
    return flatResult;
  }, [warehouses, filterLevel, filterDepartment, filterDivision, filterUnit]);

  const openModal = (mode: 'add' | 'edit', data: any) => {
    setModal({ isOpen: true, mode, data });
    setFormData({
      name: data?.name || '',
      code: data?.code || '',
      address: data?.address || '',
      departmentId: data?.departmentId || 0,
      departmentName: data?.departmentName || '',
      divisionId: data?.divisionId || 0,
      divisionName: data?.divisionName || '',
      unitId: data?.unitId || 0,
      unitName: data?.unitName || ''
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: 'add' });
    setFormData({
      name: '',
      code: '',
      address: '',
      departmentId: 0,
      departmentName: '',
      divisionId: 0,
      divisionName: '',
      unitId: 0,
      unitName: ''
    });
  };

  const findAndModify = (
    nodes: Warehouse[],
    id: number,
    action: (node: Warehouse, parent: Warehouse | null, index: number) => void,
    parent: Warehouse | null = null
  ) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.id === id) {
        action(node, parent, i);
        return true;
      }
      if (node.children && findAndModify(node.children, id, action, node)) return true;
    }
    return false;
  };

  const handleSave = async () => {
    const { mode, data } = modal;

    if (!formData.name.trim()) {
      alert('الرجاء إدخال اسم المخزن');
      return;
    }

    setIsSaving(true);
    try {
      if (mode === 'add') {
        const newWarehouseData: any = {
          name: formData.name,
          code: formData.code || `WH-${Date.now()}`,
          address: formData.address || undefined,
          departmentId: formData.departmentId || undefined,
          divisionId: formData.divisionId || undefined,
          unitId: formData.unitId || undefined,
          isActive: true,
        };

        // If this is a sub-warehouse, add parentId
        if (data?.parentId) {
          newWarehouseData.parentId = data.parentId;
          // The backend will calculate level and children
        }

        await createWarehouse(newWarehouseData);
        console.log('Warehouse created successfully');
      } else if (mode === 'edit' && data?.id) {
        const updateData = {
          name: formData.name,
          code: formData.code,
          address: formData.address || undefined,
          departmentId: formData.departmentId || undefined,
          divisionId: formData.divisionId || undefined,
          unitId: formData.unitId || undefined,
        };

        await updateWarehouse(data.id, updateData);
        console.log('Warehouse updated successfully');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert('حدث خطأ أثناء حفظ المخزن');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المخزن وجميع المخازن الفرعية التابعة له؟')) return;

    try {
      await removeWarehouse(id);
      console.log('Warehouse deleted successfully');

      // Clear selection if deleted warehouse was selected
      if (selectedWarehouse?.id === id) {
        setSelectedWarehouse(null);
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      alert('حدث خطأ أثناء حذف المخزن');
    }
  };

  // Show loading state
  if (loading && warehouses.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">جاري تحميل المخازن...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && warehouses.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <WarehouseIcon className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-red-600">خطأ في تحميل البيانات</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المخازن</CardTitle>
            <WarehouseIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">مخزن في النظام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المخازن الرئيسية</CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.main}</div>
            <p className="text-xs text-muted-foreground">مخزن رئيسي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المخازن الفرعية</CardTitle>
            <Layers className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.sub}</div>
            <p className="text-xs text-muted-foreground">مخزن فرعي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأصناف</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">صنف في جميع المخازن</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Warehouse Tree */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <WarehouseIcon className="h-5 w-5" />
                    إدارة شجرة المخازن
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    إدارة المخازن الرئيسية والفرعية في النظام
                  </p>
                </div>
                <Button onClick={() => openModal('add', {})} className="shrink-0">
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة مخزن رئيسي
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث عن مخزن..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="ml-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المستويات</SelectItem>
                  <SelectItem value="main">رئيسية فقط</SelectItem>
                  <SelectItem value="sub">فرعية فقط</SelectItem>
                  <SelectItem value="subsub">ثانوية فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="القسم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأقسام</SelectItem>
                  {apiDepartments.filter((d: any) => d.isActive).map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterDivision} onValueChange={setFilterDivision}>
                <SelectTrigger>
                  <SelectValue placeholder="الشعبة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الشعب</SelectItem>
                  {apiDivisions.filter((d: any) => d.isActive).map((div: any) => (
                    <SelectItem key={div.id} value={div.id.toString()}>
                      {div.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterUnit} onValueChange={setFilterUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="الوحدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الوحدات</SelectItem>
                  {apiUnits.filter((u: any) => u.isActive).map((unit: any) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Warehouse Tree */}
          {warehouses.length === 0 ? (
            <div className="text-center py-12">
              <WarehouseIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد مخازن</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ابدأ بإضافة مخزن رئيسي جديد
              </p>
              <Button onClick={() => openModal('add', {})}>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة مخزن رئيسي
              </Button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {(filterLevel === 'all' ? warehouses : filteredWarehouses).map((wh) => (
                <WarehouseNode
                  key={wh.id}
                  warehouse={wh}
                  onOpenModal={openModal}
                  onDelete={handleDelete}
                  onSelect={setSelectedWarehouse}
                  selectedId={selectedWarehouse?.id || null}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Warehouse Details */}
        <div className="lg:col-span-5">
          <Card className="h-full sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                تفاصيل المخزن
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedWarehouse ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedWarehouse.name}</h3>
                    <p className="text-sm text-muted-foreground">كود: {selectedWarehouse.code}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">الحالة</p>
                      <Badge variant={selectedWarehouse.isActive ? "default" : "secondary"}>
                        {selectedWarehouse.isActive ? "نشط" : "غير نشط"}
                      </Badge>
                    </div>
                    {selectedWarehouse.itemCount !== undefined && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">عدد الأصناف</p>
                        <p className="font-semibold">{selectedWarehouse.itemCount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {selectedWarehouse.address && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">العنوان</p>
                      <p className="font-medium">{selectedWarehouse.address}</p>
                    </div>
                  )}

                  {(selectedWarehouse.departmentName || selectedWarehouse.divisionName || selectedWarehouse.unitName) && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-sm">الهيكل التنظيمي</h4>
                      {selectedWarehouse.departmentName && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">القسم</p>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {selectedWarehouse.departmentName}
                          </Badge>
                        </div>
                      )}
                      {selectedWarehouse.divisionName && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">الشعبة</p>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {selectedWarehouse.divisionName}
                          </Badge>
                        </div>
                      )}
                      {selectedWarehouse.unitName && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">الوحدة</p>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            {selectedWarehouse.unitName}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedWarehouse.children && selectedWarehouse.children.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-sm">المخازن الفرعية</h4>
                      <p className="text-sm text-muted-foreground">
                        يحتوي على {selectedWarehouse.children.length} مخزن فرعي
                      </p>
                      <div className="space-y-2">
                        {selectedWarehouse.children.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center gap-2 p-2 rounded-md bg-muted/50 cursor-pointer hover:bg-muted"
                            onClick={() => setSelectedWarehouse(child)}
                          >
                            <WarehouseIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{child.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('edit', selectedWarehouse)}
                      className="flex-1"
                    >
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(selectedWarehouse.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    اختر مخزن من القائمة لعرض التفاصيل
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={modal.isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WarehouseIcon className="h-5 w-5" />
              {modal.mode === 'add' ? 'إضافة مخزن' : 'تعديل مخزن'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المخزن *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم المخزن..."
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">القسم</Label>
              <Select
                value={formData.departmentId ? formData.departmentId.toString() : ''}
                onValueChange={(value) => {
                  const deptId = parseInt(value);
                  const dept = apiDepartments.find((d: any) => d.id === deptId);
                  setFormData(prev => ({
                    ...prev,
                    departmentId: deptId || 0,
                    departmentName: dept?.name || '',
                    divisionId: 0,
                    divisionName: '',
                    unitId: 0,
                    unitName: ''
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  {apiDepartments.filter((d: any) => d.isActive).map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.departmentId > 0 && (
              <div className="space-y-2">
                <Label htmlFor="division">الشعبة</Label>
                <Select
                  value={formData.divisionId ? formData.divisionId.toString() : ''}
                  onValueChange={(value) => {
                    const divId = parseInt(value);
                    const div = apiDivisions.find((d: any) => d.id === divId);
                    setFormData(prev => ({
                      ...prev,
                      divisionId: divId || 0,
                      divisionName: div?.name || '',
                      unitId: 0,
                      unitName: ''
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشعبة" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiDivisions.filter((d: any) => d.isActive && d.departmentId === formData.departmentId).map((div: any) => (
                      <SelectItem key={div.id} value={div.id.toString()}>
                        {div.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.divisionId > 0 && (
              <div className="space-y-2">
                <Label htmlFor="unit">الوحدة</Label>
                <Select
                  value={formData.unitId ? formData.unitId.toString() : ''}
                  onValueChange={(value) => {
                    const unitId = parseInt(value);
                    const unit = apiUnits.find((u: any) => u.id === unitId);
                    setFormData(prev => ({
                      ...prev,
                      unitId: unitId || 0,
                      unitName: unit?.name || ''
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الوحدة" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiUnits.filter((u: any) => u.isActive && u.divisionId === formData.divisionId).map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {modal.mode === 'add' && modal.data?.parentId && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  سيتم إضافة هذا المخزن كمخزن فرعي
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={isSaving}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {modal.mode === 'add' ? 'إضافة' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageWarehousesPage;
