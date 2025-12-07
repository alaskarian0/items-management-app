"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronRight, Folder, File as FileIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { produce } from 'immer';

// --- DATA STRUCTURES ---
type Item = { id: string; name: string; code: string; };
type Group = { id: string; name: string; items: Item[]; };
type Store = { id: string; name: string; groups: Group[]; };

// --- MOCK DATA ---
const initialTreeData: Store[] = [
  { id: 'store-1', name: 'مخزن الأثاث', groups: [
      { id: 'group-1-1', name: 'كراسي', items: [
          { id: 'item-1-1-1', name: 'كرسي مكتب', code: 'FUR-CHR-001' },
          { id: 'item-1-1-2', name: 'كرسي قاعة', code: 'FUR-CHR-002' },
        ] },
      { id: 'group-1-2', name: 'طاولات', items: [
          { id: 'item-1-2-1', name: 'طاولة اجتماعات', code: 'FUR-TBL-001' },
        ] },
    ] },
  { id: 'store-2', name: 'مخزن السجاد', groups: [
      { id: 'group-2-1', name: 'سجاد صناعي', items: [
          { id: 'item-2-1-1', name: 'سجاد صحراوي 2*3 م', code: 'CRP-IND-001' },
        ] },
    ] },
];

// --- MODAL STATE TYPE ---
type ModalState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  type: 'store' | 'group' | 'item' | null;
  data?: { id: string; name: string; code?: string; parentId?: string };
};

const ItemsPage = () => {
  const [treeData, setTreeData] = useState<Store[]>(initialTreeData);
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({ 'store-1': true, 'group-1-1': true });
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'add', type: null });
  const [formData, setFormData] = useState({ name: '', code: '' });

  const toggleNode = (id: string) => setIsOpen(prev => ({ ...prev, [id]: !prev[id] }));

  // --- ACTION HANDLERS ---
  const openModal = (mode: 'add' | 'edit', type: 'store' | 'group' | 'item', data: ModalState['data']) => {
    setModal({ isOpen: true, mode, type, data });
    setFormData({ name: data?.name || '', code: data?.code || '' });
  };
  
  const closeModal = () => setModal({ isOpen: false, mode: 'add', type: null });

  const handleSave = () => {
    if (!modal.type) return;

    setTreeData(produce(draft => {
      const { type, mode, data } = modal;
      if (mode === 'add') {
        const newItem = { id: `item-${Date.now()}`, name: formData.name, code: formData.code };
        const newGroup = { id: `group-${Date.now()}`, name: formData.name, items: [] };
        
        for (const store of draft) {
          if (type === 'group' && store.id === data?.parentId) store.groups.push(newGroup);
          for (const group of store.groups) {
            if (type === 'item' && group.id === data?.parentId) group.items.push(newItem);
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
               }
             }
           }
         }
      }
    }));
    closeModal();
  };
  
  const handleDelete = (type: 'store' | 'group' | 'item', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    setTreeData(produce(draft => {
      if (type === 'store') return draft.filter(s => s.id !== id);
      for (const store of draft) {
        if (type === 'group') store.groups = store.groups.filter(g => g.id !== id);
        for (const group of store.groups) {
          if (type === 'item') group.items = group.items.filter(i => i.id !== id);
        }
      }
    }));
  };
  
  const ActionButtons = ({ onEdit, onDelete, onAdd }: { onEdit?: () => void, onDelete?: () => void, onAdd?: () => void }) => (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mr-auto">
      {onAdd && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onAdd}><PlusCircle className="h-4 w-4 text-green-500" /></Button>}
      {onEdit && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onEdit}><Edit className="h-4 w-4 text-blue-500" /></Button>}
      {onDelete && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDelete}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>شجرة المواد</CardTitle>
          <Button onClick={() => openModal('add', 'store', { id: `temp-${Date.now()}`, name: '' })}>
            <PlusCircle className="ml-2 h-4 w-4" />إضافة مخزن
          </Button>
        </CardHeader>
        <CardContent className="p-6 font-mono text-sm">
          {treeData.map(store => (
            <Collapsible key={store.id} open={isOpen[store.id]} onOpenChange={() => toggleNode(store.id)} className="pr-4">
              <div className="flex items-center gap-2 group mb-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
                <CollapsibleTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6">{isOpen[store.id] ? <ChevronDown /> : <ChevronRight />}</Button></CollapsibleTrigger>
                <Folder className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">{store.name}</span>
                <ActionButtons onAdd={() => openModal('add', 'group', { id: `temp-${Date.now()}`, parentId: store.id, name: '' })} onEdit={() => openModal('edit', 'store', store)} onDelete={() => handleDelete('store', store.id)} />
              </div>
              <CollapsibleContent className="pr-6 border-r-2 border-dashed border-gray-300 dark:border-gray-700">
                {store.groups.map(group => (
                  <Collapsible key={group.id} open={isOpen[group.id]} onOpenChange={() => toggleNode(group.id)} className="pr-4 mt-2">
                    <div className="flex items-center gap-2 group mb-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 p-1">
                      <CollapsibleTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6">{isOpen[group.id] ? <ChevronDown /> : <ChevronRight />}</Button></CollapsibleTrigger>
                      <Folder className="h-5 w-5 text-blue-400" />
                      <span>{group.name}</span>
                      <ActionButtons onAdd={() => openModal('add', 'item', { id: `temp-${Date.now()}`, parentId: group.id, name: '', code: '' })} onEdit={() => openModal('edit', 'group', group)} onDelete={() => handleDelete('group', group.id)} />
                    </div>
                    <CollapsibleContent className="pr-8 border-r-2 border-dashed border-gray-300 dark:border-gray-700">
                      {group.items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 group mt-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                           <div className="w-6 shrink-0"></div>
                           <FileIcon className="h-5 w-5 text-gray-400 shrink-0" />
                           <span>{item.name} <span className="text-xs text-muted-foreground">({item.code})</span></span>
                           <ActionButtons onEdit={() => openModal('edit', 'item', item)} onDelete={() => handleDelete('item', item.id)} />
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      {/* --- DIALOG --- */}
      <Dialog open={modal.isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`${modal.mode === 'add' ? 'إضافة' : 'تعديل'} ${ modal.type === 'store' ? 'مخزن' : modal.type === 'group' ? 'مجموعة' : 'مادة'}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">الاسم</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} className="col-span-3" />
            </div>
            {modal.type === 'item' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">الكود</Label>
                <Input id="code" value={formData.code} onChange={e => setFormData(f => ({ ...f, code: e.target.value }))} className="col-span-3" />
              </div>
            )}
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

export default ItemsPage;
