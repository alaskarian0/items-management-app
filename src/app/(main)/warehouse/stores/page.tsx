"use client";

import React, { useState, useMemo } from 'react';
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
import { produce } from 'immer';

// Import shared data and types
import {
  warehouseStores,
  warehouses,
  type WarehouseStore,
  type Warehouse
} from "@/lib/data/warehouse-data";

// Convert warehouse data to hierarchical structure for display
const initialWarehouseData: WarehouseStore[] = warehouseStores;

// --- MODAL STATE TYPE ---
type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  data?: { id: string; name: string; parentId?: string };
};

// --- RECURSIVE WAREHOUSE NODE COMPONENT ---
const WarehouseNode = ({
  warehouse,
  onOpenModal,
  onDelete,
  level = 0,
  searchTerm = '',
}: {
  warehouse: Warehouse;
  onOpenModal: (mode: 'add' | 'edit', data: any) => void;
  onDelete: (id: string) => void;
  level?: number;
  searchTerm?: string;
}) => {
  const [isOpen, setIsOpen] = useState(level < 2);

  // Check if this warehouse or any child matches search
  const matchesSearch = (wh: Warehouse, term: string): boolean => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    if (wh.name.toLowerCase().includes(lowerTerm)) return true;
    return wh.children.some(child => matchesSearch(child, term));
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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pr-2 mt-1">
      <div className={`flex items-center gap-2 group mb-0.5 rounded-lg hover:bg-muted/50 p-2 transition-all border ${
        isHighlighted ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'
      }`}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            disabled={warehouse.children.length === 0}
          >
            {warehouse.children.length > 0 ? (
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
            <span className={`font-semibold text-sm truncate ${isHighlighted ? 'text-primary' : ''}`}>
              {warehouse.name}
            </span>
            <Badge variant="outline" className="text-xs h-5">
              {getLevelBadge(level)}
            </Badge>
            {warehouse.children.length > 0 && (
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

      {warehouse.children.length > 0 && (
        <CollapsibleContent className="pr-4 border-r-2 border-dashed border-muted-foreground/20 mr-3">
          {warehouse.children.map((child) => (
            <WarehouseNode
              key={child.id}
              warehouse={child}
              onOpenModal={onOpenModal}
              onDelete={onDelete}
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
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouseData);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'add' });
  const [formData, setFormData] = useState({ name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

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
        node.children.forEach((child) => traverse(child, depth + 1));
      };

      nodes.forEach((node) => traverse(node, 0));

      return { total, main, sub, depth: maxDepth + 1, totalItems };
    };

    return countWarehouses(warehouses);
  }, [warehouses]);

  // Filter warehouses by level
  const filteredWarehouses = useMemo(() => {
    if (filterLevel === 'all') return warehouses;

    const filterByLevel = (nodes: Warehouse[], currentLevel: number, targetLevel: number): Warehouse[] => {
      if (currentLevel === targetLevel) return nodes;

      return nodes.flatMap(node =>
        filterByLevel(node.children, currentLevel + 1, targetLevel)
      );
    };

    const levelMap: Record<string, number> = {
      'main': 0,
      'sub': 1,
      'subsub': 2,
    };

    const targetLevel = levelMap[filterLevel];
    if (targetLevel === 0) {
      return warehouses;
    }

    // For sub-warehouses, show them in a flat structure
    const result: Warehouse[] = [];
    const collectLevel = (nodes: Warehouse[], currentLevel: number) => {
      nodes.forEach(node => {
        if (currentLevel === targetLevel) {
          result.push(node);
        }
        if (node.children.length > 0) {
          collectLevel(node.children, currentLevel + 1);
        }
      });
    };

    collectLevel(warehouses, 0);
    return result;
  }, [warehouses, filterLevel]);

  const openModal = (mode: 'add' | 'edit', data: any) => {
    setModal({ isOpen: true, mode, data });
    setFormData({ name: data?.name || '' });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: 'add' });
    setFormData({ name: '' });
  };

  const findAndModify = (
    nodes: Warehouse[],
    id: string,
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

  const handleSave = () => {
    const { mode, data } = modal;
    if (!data) return;

    if (!formData.name.trim()) {
      alert('الرجاء إدخال اسم المخزن');
      return;
    }

    setWarehouses(
      produce((draft) => {
        if (mode === 'add') {
          const newWarehouse: Warehouse = {
            id: `wh-${Date.now()}`,
            name: formData.name,
            itemCount: 0,
            children: [],
          };
          if (data.parentId) {
            // Adding a child
            findAndModify(draft, data.parentId, (node) => {
              node.children.push(newWarehouse);
            });
          } else {
            // Adding a root
            draft.push(newWarehouse);
          }
        } else if (mode === 'edit') {
          findAndModify(draft, data.id, (node) => {
            node.name = formData.name;
          });
        }
      })
    );

    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المخزن وجميع المخازن الفرعية التابعة له؟')) return;

    setWarehouses(
      produce((draft) => {
        findAndModify(draft, id, (node, parent, index) => {
          if (parent) {
            parent.children.splice(index, 1);
          } else {
            // root node
            draft.splice(index, 1);
          }
        });
      })
    );
  };

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

      {/* Main Card */}
      <Card>
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
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={modal.isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WarehouseIcon className="h-5 w-5" />
              {modal.mode === 'add' ? 'إضافة مخزن' : 'تعديل مخزن'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المخزن</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="أدخل اسم المخزن..."
                autoFocus
              />
            </div>
            {modal.mode === 'add' && modal.data?.parentId && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  سيتم إضافة هذا المخزن كمخزن فرعي
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>
              {modal.mode === 'add' ? 'إضافة' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageWarehousesPage;
