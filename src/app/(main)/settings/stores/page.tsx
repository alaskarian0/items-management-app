"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronRight, Warehouse as WarehouseIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { produce } from 'immer';

// --- DATA STRUCTURES ---
type Warehouse = {
  id: string;
  name: string;
  children: Warehouse[];
};

// --- MOCK DATA ---
const initialWarehouseData: Warehouse[] = [
  {
    id: 'store-1',
    name: 'المخزن الرئيسي',
    children: [
      {
        id: 'group-1-1',
        name: 'مخزن شعبة المواد الثابتة',
        children: [
            { id: 'sub-1-1-1', name: 'مخزن الأثاث والممتلكات العامة', children: [] },
            { id: 'sub-1-1-2', name: 'مخزن السجاد والمفروشات', children: [] },
        ],
      },
      {
        id: 'group-1-2',
        name: 'مخزن شعبة المواد الاستهلاكية',
        children: [
            { id: 'sub-1-2-1', name: 'مخزن المواد العامة', children: [] },
        ],
      },
    ],
  },
];

// --- MODAL STATE TYPE ---
type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  data?: { id: string; name: string; parentId?: string };
};

// --- RECURSIVE WAREHOUSE NODE COMPONENT ---
const WarehouseNode = ({ warehouse, onOpenModal, onDelete, level = 0 }: { warehouse: Warehouse, onOpenModal: (mode: 'add' | 'edit', data: any) => void, onDelete: (id: string) => void, level?: number }) => {
  const [isOpen, setIsOpen] = useState(level < 2);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pr-4 mt-2">
      <div className="flex items-center gap-2 group mb-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6" disabled={warehouse.children.length === 0}>
            {isOpen ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </CollapsibleTrigger>
        <WarehouseIcon className="h-5 w-5 text-gray-500" />
        <span className="font-semibold">{warehouse.name}</span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 mr-auto">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onOpenModal('add', { parentId: warehouse.id })}><PlusCircle className="h-4 w-4 text-green-500" /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onOpenModal('edit', warehouse)}><Edit className="h-4 w-4 text-blue-500" /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDelete(warehouse.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
        </div>
      </div>
      <CollapsibleContent className="pr-6 border-r-2 border-dashed border-gray-300 dark:border-gray-700">
        {warehouse.children.map(child => (
          <WarehouseNode key={child.id} warehouse={child} onOpenModal={onOpenModal} onDelete={onDelete} level={level + 1} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};


const ManageWarehousesPage = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouseData);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'add' });
  const [formData, setFormData] = useState({ name: '' });

  const openModal = (mode: 'add' | 'edit', data: any) => {
    setModal({ isOpen: true, mode, data });
    setFormData({ name: data?.name || '' });
  };
  
  const closeModal = () => setModal({ isOpen: false, mode: 'add' });
  
  const findAndModify = (nodes: Warehouse[], id: string, action: (node: Warehouse, parent: Warehouse | null, index: number) => void, parent: Warehouse | null = null) => {
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

    setWarehouses(produce(draft => {
        if (mode === 'add') {
            const newWarehouse: Warehouse = { id: `wh-${Date.now()}`, name: formData.name, children: [] };
            if (data.parentId) { // Adding a child
                findAndModify(draft, data.parentId, (node) => {
                    node.children.push(newWarehouse);
                });
            } else { // Adding a root
                draft.push(newWarehouse);
            }
        } else if (mode === 'edit') {
            findAndModify(draft, data.id, (node) => {
                node.name = formData.name;
            });
        }
    }));

    closeModal();
  };
  
  const handleDelete = (id: string) => {
     if (!confirm(`Are you sure you want to delete this warehouse and all its sub-warehouses?`)) return;
     setWarehouses(produce(draft => {
        findAndModify(draft, id, (node, parent, index) => {
            if (parent) {
                parent.children.splice(index, 1);
            } else { // root node
                draft.splice(index, 1);
            }
        });
     }));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة شجرة المخازن</CardTitle>
          <Button onClick={() => openModal('add', {})}>
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة مخزن رئيسي
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {warehouses.map(wh => (
            <WarehouseNode key={wh.id} warehouse={wh} onOpenModal={openModal} onDelete={handleDelete} />
          ))}
        </CardContent>
      </Card>

      <Dialog open={modal.isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`${modal.mode === 'add' ? 'إضافة' : 'تعديل'} مخزن`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="name">اسم المخزن</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({ name: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageWarehousesPage;
