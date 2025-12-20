"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { produce } from 'immer';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  File as FileIcon,
  Filter,
  Folder,
  FolderTree,
  Hash,
  Layers,
  Package,
  PlusCircle,
  Search,
  Trash2,
  Warehouse,
  X
} from "lucide-react";
import { useMemo, useState } from 'react';

// --- DATA STRUCTURES ---
type WarehouseAssignment = {
  warehouseId: string;
  warehouseName: string;
  stock: number;
};

type Item = {
  id: string;
  name: string;
  code: string;
  quantity?: number;
  unit?: string;
  warehouses?: WarehouseAssignment[];
};

type Group = {
  id: string;
  name: string;
  items: Item[];
};

type Store = {
  id: string;
  name: string;
  groups: Group[];
};

// Available warehouses for assignment
const availableWarehouses = [
  { id: 'wh-1', name: 'المخزن الرئيسي' },
  { id: 'wh-2', name: 'مخزن المواد الثابتة' },
  { id: 'wh-3', name: 'مخزن المواد الاستهلاكية' },
  { id: 'wh-4', name: 'مخزن الأثاث' },
  { id: 'wh-5', name: 'مخزن المفروشات' },
];

// --- MOCK DATA ---
const initialTreeData: Store[] = [
  {
    id: 'store-1',
    name: 'مخزن الأثاث',
    groups: [
      {
        id: 'group-1-1',
        name: 'كراسي',
        items: [
          {
            id: 'item-1-1-1',
            name: 'كرسي مكتب',
            code: 'FUR-CHR-001',
            quantity: 150,
            unit: 'قطعة',
            warehouses: [
              { warehouseId: 'wh-1', warehouseName: 'المخزن الرئيسي', stock: 100 },
              { warehouseId: 'wh-4', warehouseName: 'مخزن الأثاث', stock: 50 },
            ]
          },
          { id: 'item-1-1-2', name: 'كرسي قاعة', code: 'FUR-CHR-002', quantity: 85, unit: 'قطعة' },
        ],
      },
      {
        id: 'group-1-2',
        name: 'طاولات',
        items: [
          { id: 'item-1-2-1', name: 'طاولة اجتماعات', code: 'FUR-TBL-001', quantity: 25, unit: 'قطعة' },
          { id: 'item-1-2-2', name: 'طاولة مكتب', code: 'FUR-TBL-002', quantity: 120, unit: 'قطعة' },
        ],
      },
    ],
  },
  {
    id: 'store-2',
    name: 'مخزن السجاد',
    groups: [
      {
        id: 'group-2-1',
        name: 'سجاد صناعي',
        items: [
          { id: 'item-2-1-1', name: 'سجاد صحراوي 2*3 م', code: 'CRP-IND-001', quantity: 45, unit: 'متر' },
          { id: 'item-2-1-2', name: 'سجاد فارسي 3*4 م', code: 'CRP-IND-002', quantity: 32, unit: 'متر' },
        ],
      },
      {
        id: 'group-2-2',
        name: 'سجاد طبيعي',
        items: [
          { id: 'item-2-2-1', name: 'سجاد صوف 2*3 م', code: 'CRP-NAT-001', quantity: 18, unit: 'متر' },
        ],
      },
    ],
  },
];

// --- MODAL STATE TYPE ---
type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  type: 'store' | 'group' | 'item' | null;
  data?: { id: string; name: string; code?: string; quantity?: number; unit?: string; parentId?: string };
};

type WarehouseModalState = {
  isOpen: boolean;
  item: Item | null;
  assignments: WarehouseAssignment[];
};

// Group Node Component
const GroupNode = ({
  group,
  storeId,
  onOpenModal,
  onDelete,
  onManageWarehouses,
  onSelectItem,
  selectedItemId,
  searchTerm,
  level = 1,
}: {
  group: Group;
  storeId: string;
  onOpenModal: (mode: 'add' | 'edit', type: 'store' | 'group' | 'item', data: any) => void;
  onDelete: (type: 'store' | 'group' | 'item', id: string) => void;
  onManageWarehouses: (item: Item) => void;
  onSelectItem: (item: Item) => void;
  selectedItemId: string | null;
  searchTerm: string;
  level?: number;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const matchesSearch = (text: string) => {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const hasMatchingItem = group.items.some(
    (item) => matchesSearch(item.name) || matchesSearch(item.code)
  );
  const groupMatches = matchesSearch(group.name);

  if (!groupMatches && !hasMatchingItem && searchTerm) return null;

  const itemCount = group.items.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pr-2 mt-1">
      <div
        className={`flex items-center gap-2 group mb-0.5 rounded-lg hover:bg-muted/50 p-2 transition-all border ${
          groupMatches && searchTerm ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'
        }`}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </Button>
        </CollapsibleTrigger>
        <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600">
          <Folder className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-sm ${groupMatches && searchTerm ? 'text-primary' : ''}`}>
              {group.name}
            </span>
            <Badge variant="secondary" className="text-xs h-5">
              {itemCount} مادة
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              onOpenModal('add', 'item', {
                id: `temp-${Date.now()}`,
                parentId: group.id,
                name: '',
                code: '',
              })
            }
            title="إضافة مادة"
          >
            <PlusCircle className="h-3.5 w-3.5 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onOpenModal('edit', 'group', group)}
            title="تعديل"
          >
            <Edit className="h-3.5 w-3.5 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDelete('group', group.id)}
            title="حذف"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </Button>
        </div>
      </div>

      <CollapsibleContent className="pr-4 border-r-2 border-dashed border-muted-foreground/20 mr-3">
        {group.items.map((item) => {
          const itemMatches = matchesSearch(item.name) || matchesSearch(item.code);
          if (!itemMatches && searchTerm) return null;
          const isSelected = item.id === selectedItemId;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-2 group mt-1 p-2 rounded-lg transition-all border ${
                isSelected ? 'bg-primary/10 border-primary' : itemMatches && searchTerm ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border hover:bg-muted/50'
              }`}
            >
              <div className="w-7 shrink-0"></div>
              <div className="p-1.5 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-500">
                <FileIcon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => onSelectItem(item)}
                  className="w-full text-right"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium hover:text-primary cursor-pointer ${isSelected || (itemMatches && searchTerm) ? 'text-primary' : ''}`}>
                      {item.name}
                    </span>
                    <code className="text-xs px-1.5 py-0.5 bg-muted rounded">{item.code}</code>
                    {item.quantity !== undefined && (
                      <Badge variant="outline" className="text-xs h-5">
                        {item.quantity} {item.unit}
                      </Badge>
                    )}
                    {item.warehouses && item.warehouses.length > 0 && (
                      <Badge variant="secondary" className="text-xs h-5 bg-green-100 text-green-700">
                        <Warehouse className="h-3 w-3 ml-1" />
                        {item.warehouses.length} مخزن
                      </Badge>
                    )}
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onManageWarehouses(item)}
                  title="إدارة المخازن"
                >
                  <Warehouse className="h-3.5 w-3.5 text-purple-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onOpenModal('edit', 'item', item)}
                  title="تعديل"
                >
                  <Edit className="h-3.5 w-3.5 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onDelete('item', item.id)}
                  title="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};

// Store Node Component
const StoreNode = ({
  store,
  onOpenModal,
  onDelete,
  onManageWarehouses,
  onSelectItem,
  selectedItemId,
  searchTerm,
}: {
  store: Store;
  onOpenModal: (mode: 'add' | 'edit', type: 'store' | 'group' | 'item', data: any) => void;
  onDelete: (type: 'store' | 'group' | 'item', id: string) => void;
  onManageWarehouses: (item: Item) => void;
  onSelectItem: (item: Item) => void;
  selectedItemId: string | null;
  searchTerm: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const matchesSearch = (text: string) => {
    if (!searchTerm) return true;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const hasMatchingContent = store.groups.some(
    (group) =>
      matchesSearch(group.name) || group.items.some((item) => matchesSearch(item.name) || matchesSearch(item.code))
  );

  const storeMatches = matchesSearch(store.name);

  if (!storeMatches && !hasMatchingContent && searchTerm) return null;

  const totalItems = store.groups.reduce((sum, g) => sum + g.items.length, 0);
  const groupCount = store.groups.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pr-2 mt-1">
      <div
        className={`flex items-center gap-2 group mb-0.5 rounded-lg hover:bg-muted/50 p-2 transition-all border ${
          storeMatches && searchTerm ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'
        }`}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
            {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </Button>
        </CollapsibleTrigger>
        <div className="p-1.5 rounded-md bg-yellow-50 dark:bg-yellow-950 text-yellow-600">
          <Folder className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-sm ${storeMatches && searchTerm ? 'text-primary' : ''}`}>
              {store.name}
            </span>
            <Badge variant="outline" className="text-xs h-5">
              مخزن
            </Badge>
            <Badge variant="secondary" className="text-xs h-5">
              {groupCount} مجموعة
            </Badge>
            <Badge variant="default" className="text-xs h-5 bg-blue-600">
              <Package className="h-3 w-3 ml-1" />
              {totalItems} مادة
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() =>
              onOpenModal('add', 'group', {
                id: `temp-${Date.now()}`,
                parentId: store.id,
                name: '',
              })
            }
            title="إضافة مجموعة"
          >
            <PlusCircle className="h-3.5 w-3.5 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onOpenModal('edit', 'store', store)}
            title="تعديل"
          >
            <Edit className="h-3.5 w-3.5 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onDelete('store', store.id)}
            title="حذف"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </Button>
        </div>
      </div>

      <CollapsibleContent className="pr-4 border-r-2 border-dashed border-muted-foreground/20 mr-3">
        {store.groups.map((group) => (
          <GroupNode
            key={group.id}
            group={group}
            storeId={store.id}
            onOpenModal={onOpenModal}
            onDelete={onDelete}
            onManageWarehouses={onManageWarehouses}
            onSelectItem={onSelectItem}
            selectedItemId={selectedItemId}
            searchTerm={searchTerm}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const ItemsPage = () => {
  const [treeData, setTreeData] = useState<Store[]>(initialTreeData);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'add', type: null });
  const [warehouseModal, setWarehouseModal] = useState<WarehouseModalState>({
    isOpen: false,
    item: null,
    assignments: []
  });
  const [formData, setFormData] = useState({ name: '', code: '', quantity: '', unit: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [filterStore, setFilterStore] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<string>('');

  // Apply filters to tree data
  const filteredTreeData = useMemo(() => {
    let filtered = treeData;

    // Filter by store
    if (filterStore) {
      filtered = filtered.filter(store => store.id === filterStore);
    }

    // Filter by group
    if (filterGroup) {
      filtered = filtered.map(store => ({
        ...store,
        groups: store.groups.filter(group => group.id === filterGroup)
      })).filter(store => store.groups.length > 0);
    }

    return filtered;
  }, [treeData, filterStore, filterGroup]);

  // Get available groups based on selected store
  const availableGroups = useMemo(() => {
    if (!filterStore) {
      return treeData.flatMap(store => store.groups);
    }
    const store = treeData.find(s => s.id === filterStore);
    return store?.groups || [];
  }, [treeData, filterStore]);

  // Clear filters function
  const clearFilters = () => {
    setFilterStore('');
    setFilterGroup('');
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStores = treeData.length;
    let totalGroups = 0;
    let totalItems = 0;

    treeData.forEach((store) => {
      totalGroups += store.groups.length;
      store.groups.forEach((group) => {
        totalItems += group.items.length;
      });
    });

    return { totalStores, totalGroups, totalItems };
  }, [treeData]);

  const openModal = (mode: 'add' | 'edit', type: 'store' | 'group' | 'item', data: ModalState['data']) => {
    setModal({ isOpen: true, mode, type, data });
    setFormData({
      name: data?.name || '',
      code: data?.code || '',
      quantity: data?.quantity?.toString() || '',
      unit: data?.unit || '',
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: 'add', type: null });
    setFormData({ name: '', code: '', quantity: '', unit: '' });
  };

  const openWarehouseModal = (item: Item) => {
    setWarehouseModal({
      isOpen: true,
      item,
      assignments: item.warehouses || [],
    });
  };

  const closeWarehouseModal = () => {
    setWarehouseModal({ isOpen: false, item: null, assignments: [] });
  };

  const handleWarehouseToggle = (warehouseId: string, warehouseName: string, checked: boolean) => {
    setWarehouseModal(prev => ({
      ...prev,
      assignments: checked
        ? [...prev.assignments, { warehouseId, warehouseName, stock: 0 }]
        : prev.assignments.filter(a => a.warehouseId !== warehouseId)
    }));
  };

  const handleStockChange = (warehouseId: string, stock: number) => {
    setWarehouseModal(prev => ({
      ...prev,
      assignments: prev.assignments.map(a =>
        a.warehouseId === warehouseId ? { ...a, stock } : a
      )
    }));
  };

  const saveWarehouseAssignments = () => {
    if (!warehouseModal.item) return;

    setTreeData(produce(draft => {
      for (const store of draft) {
        for (const group of store.groups) {
          for (const item of group.items) {
            if (item.id === warehouseModal.item?.id) {
              item.warehouses = warehouseModal.assignments;
              // Update total quantity
              item.quantity = warehouseModal.assignments.reduce((sum, a) => sum + a.stock, 0);
            }
          }
        }
      }
    }));

    closeWarehouseModal();
  };

  const handleSave = () => {
    if (!modal.type) return;

    if (!formData.name.trim()) {
      alert('الرجاء إدخال الاسم');
      return;
    }

    if (modal.type === 'item' && !formData.code.trim()) {
      alert('الرجاء إدخال كود المادة');
      return;
    }

    setTreeData(
      produce((draft) => {
        const { type, mode, data } = modal;
        if (mode === 'add') {
          const newItem = {
            id: `item-${Date.now()}`,
            name: formData.name,
            code: formData.code,
            quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
            unit: formData.unit || undefined,
          };
          const newGroup = { id: `group-${Date.now()}`, name: formData.name, items: [] };
          const newStore = { id: `store-${Date.now()}`, name: formData.name, groups: [] };

          if (type === 'store') {
            draft.push(newStore);
          } else {
            for (const store of draft) {
              if (type === 'group' && store.id === data?.parentId) store.groups.push(newGroup);
              for (const group of store.groups) {
                if (type === 'item' && group.id === data?.parentId) group.items.push(newItem);
              }
            }
          }
        } else if (mode === 'edit' && data) {
          for (const store of draft) {
            if (type === 'store' && store.id === data.id) store.name = formData.name;
            for (const group of store.groups) {
              if (type === 'group' && group.id === data.id) group.name = formData.name;
              for (const item of group.items) {
                if (type === 'item' && item.id === data.id) {
                  item.name = formData.name;
                  item.code = formData.code;
                  item.quantity = formData.quantity ? parseInt(formData.quantity) : undefined;
                  item.unit = formData.unit || undefined;
                }
              }
            }
          }
        }
      })
    );
    closeModal();
  };

  const handleDelete = (type: 'store' | 'group' | 'item', id: string) => {
    const typeLabels = { store: 'مخزن', group: 'مجموعة', item: 'مادة' };
    if (!confirm(`هل أنت متأكد من حذف هذا ${typeLabels[type]}؟`)) return;

    setTreeData(
      produce((draft) => {
        if (type === 'store') {
          return draft.filter((s) => s.id !== id);
        }
        for (const store of draft) {
          if (type === 'group') store.groups = store.groups.filter((g) => g.id !== id);
          for (const group of store.groups) {
            if (type === 'item') group.items = group.items.filter((i) => i.id !== id);
          }
        }
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المخازن</CardTitle>
            <Folder className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalStores}</div>
            <p className="text-xs text-muted-foreground">مخزن مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المجموعات</CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalGroups}</div>
            <p className="text-xs text-muted-foreground">مجموعة مسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المواد</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">مادة مسجلة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الأكواد</CardTitle>
            <Hash className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">كود فريد</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel - Items Tree */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5" />
                    شجرة المواد
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    إدارة المخازن والمجموعات والمواد في النظام
                  </p>
                </div>
                <Button
                  onClick={() => openModal('add', 'store', { id: `temp-${Date.now()}`, name: '' })}
                  className="shrink-0"
                >
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة مجموعة جديدة
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث عن مخزن، مجموعة أو مادة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Filters Section */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-semibold">التصفية</Label>
                </div>
                {(filterStore || filterGroup) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 text-xs"
                  >
                    <X className="h-3 w-3 ml-1" />
                    مسح الفلاتر
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Store Filter */}
                <div className="space-y-2">
                  <Label htmlFor="filter-store" className="text-xs">المخزن</Label>
                  <Select
                    value={filterStore || "all"}
                    onValueChange={(value) => {
                      setFilterStore(value === "all" ? "" : value);
                      if (value === "all") {
                        setFilterGroup("");
                      }
                    }}
                  >
                    <SelectTrigger id="filter-store" className="h-9">
                      <SelectValue placeholder="كل المخازن" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل المخازن</SelectItem>
                      {treeData.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Group Filter */}
                <div className="space-y-2">
                  <Label htmlFor="filter-group" className="text-xs">المجموعة</Label>
                  <Select
                    value={filterGroup || "all"}
                    onValueChange={(value) => setFilterGroup(value === "all" ? "" : value)}
                    disabled={!filterStore && availableGroups.length === 0}
                  >
                    <SelectTrigger id="filter-group" className="h-9">
                      <SelectValue placeholder="كل المجموعات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل المجموعات</SelectItem>
                      {availableGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Tree */}
          {filteredTreeData.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد بيانات</h3>
              <p className="text-sm text-muted-foreground mb-4">ابدأ بإضافة مجموعة جديدة</p>
              <Button onClick={() => openModal('add', 'store', { id: `temp-${Date.now()}`, name: '' })}>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة مجموعة جديدة
              </Button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredTreeData.map((store) => (
                <StoreNode
                  key={store.id}
                  store={store}
                  onOpenModal={openModal}
                  onDelete={handleDelete}
                  onManageWarehouses={openWarehouseModal}
                  onSelectItem={setSelectedItem}
                  selectedItemId={selectedItem?.id || null}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Item Details */}
        <div className="lg:col-span-5">
          <Card className="h-full sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                تفاصيل المادة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedItem.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">كود: {selectedItem.code}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedItem.quantity !== undefined && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">الكمية</p>
                        <p className="font-semibold text-lg">{selectedItem.quantity}</p>
                      </div>
                    )}
                    {selectedItem.unit && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">الوحدة</p>
                        <p className="font-semibold">{selectedItem.unit}</p>
                      </div>
                    )}
                  </div>

                  {selectedItem.warehouses && selectedItem.warehouses.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <Warehouse className="h-4 w-4" />
                        توزيع المخازن
                      </h4>
                      <div className="space-y-2">
                        {selectedItem.warehouses.map((wh) => (
                          <div
                            key={wh.warehouseId}
                            className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                          >
                            <span className="text-sm font-medium">{wh.warehouseName}</span>
                            <Badge variant="secondary" className="font-mono">
                              {wh.stock} {selectedItem.unit}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold">إجمالي الكمية:</span>
                          <span className="text-lg font-bold text-primary">
                            {selectedItem.warehouses.reduce((sum, w) => sum + w.stock, 0)} {selectedItem.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openWarehouseModal(selectedItem)}
                      className="flex-1"
                    >
                      <Warehouse className="ml-2 h-4 w-4" />
                      إدارة المخازن
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('edit', 'item', selectedItem)}
                      className="flex-1"
                    >
                      <Edit className="ml-2 h-4 w-4" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete('item', selectedItem.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    اختر مادة من القائمة لعرض التفاصيل
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Item Edit Dialog */}
      <Dialog open={modal.isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modal.type === 'store' && <Folder className="h-5 w-5 text-yellow-600" />}
              {modal.type === 'group' && <Folder className="h-5 w-5 text-blue-600" />}
              {modal.type === 'item' && <FileIcon className="h-5 w-5 text-gray-600" />}
              {`${modal.mode === 'add' ? 'إضافة' : 'تعديل'} ${
                modal.type === 'store' ? 'مخزن' : modal.type === 'group' ? 'مجموعة' : 'مادة'
              }`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="أدخل الاسم..."
                autoFocus
              />
            </div>
            {modal.type === 'item' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="code">الكود</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData((f) => ({ ...f, code: e.target.value }))}
                    placeholder="مثال: FUR-CHR-001"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">الكمية</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData((f) => ({ ...f, quantity: e.target.value }))}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">الوحدة</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData((f) => ({ ...f, unit: e.target.value }))}
                      placeholder="قطعة، متر، كغم..."
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>{modal.mode === 'add' ? 'إضافة' : 'حفظ'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warehouse Management Dialog */}
      <Dialog open={warehouseModal.isOpen} onOpenChange={closeWarehouseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-purple-600" />
              إدارة المخازن - {warehouseModal.item?.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              اختر المخازن التي تحتوي على هذه المادة وحدد الكميات في كل مخزن
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {availableWarehouses.map((warehouse) => {
              const assignment = warehouseModal.assignments.find(a => a.warehouseId === warehouse.id);
              const isAssigned = !!assignment;

              return (
                <div key={warehouse.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Checkbox
                    id={`wh-${warehouse.id}`}
                    checked={isAssigned}
                    onCheckedChange={(checked) =>
                      handleWarehouseToggle(warehouse.id, warehouse.name, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label htmlFor={`wh-${warehouse.id}`} className="font-medium cursor-pointer">
                      {warehouse.name}
                    </Label>
                  </div>
                  {isAssigned && (
                    <div className="w-32">
                      <Input
                        type="number"
                        min="0"
                        value={assignment.stock}
                        onChange={(e) => handleStockChange(warehouse.id, parseInt(e.target.value) || 0)}
                        placeholder="الكمية"
                        className="text-center"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="font-semibold">إجمالي الكمية:</span>
              <span className="text-xl font-bold text-primary">
                {warehouseModal.assignments.reduce((sum, a) => sum + a.stock, 0)} {warehouseModal.item?.unit || ''}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeWarehouseModal}>
              إلغاء
            </Button>
            <Button onClick={saveWarehouseAssignments}>
              حفظ التوزيع
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemsPage;
