"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useImmer } from 'use-immer';
import { WarehouseSelector } from "@/components/warehouse/warehouse-selector";
import { useWarehouse } from "@/context/warehouse-context";

// --- MOCK DATA (to be replaced with API calls) ---
const departments = [{ id: 1, name: "قسم الشؤون الهندسية" }, { id: 2, name: "قسم الشؤون الإدارية" }];
const items = [
    { id: 1, name: 'كرسي مكتب', code: 'FUR-CHR-001', unit: 'قطعة', stock: 50 },
    { id: 2, name: 'طاولة اجتماعات', code: 'FUR-TBL-001', unit: 'قطعة', stock: 10 },
    { id: 3, name: 'سجاد صحراوي 2*3 م', code: 'CRP-IND-001', unit: 'قطعة', stock: 120 }
];

type DocumentItem = {
    id: number;
    itemId: number | null;
    itemName: string;
    unit: string;
    quantity: number;
    stock: number;
    notes?: string;
};

const ItemIssuancePage = () => {
    const { selectedWarehouse } = useWarehouse();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [docNumber, setDocNumber] = useState('2305');
    const [department, setDepartment] = useState<string>();
    const [recipientName, setRecipientName] = useState('');
    const [generalNotes, setGeneralNotes] = useState('');
    const [itemsList, updateItemsList] = useImmer<DocumentItem[]>([]);

    const handleAddItem = () => {
        updateItemsList(draft => {
            draft.push({
                id: Date.now(),
                itemId: null,
                itemName: '',
                unit: '',
                quantity: 1,
                stock: 0,
            });
        });
    };

    const handleItemChange = <K extends keyof DocumentItem>(index: number, field: K, value: DocumentItem[K]) => {
        updateItemsList(draft => {
            const item = draft[index];
            if (item) {
                item[field] = value;
                if(field === 'itemName'){
                    const selectedItem = items.find(i => i.name === value);
                    if(selectedItem){
                        item.unit = selectedItem.unit;
                        item.itemId = selectedItem.id;
                        item.stock = selectedItem.stock;
                    }
                }
            }
        });
    };

    const handleRemoveItem = (index: number) => {
        updateItemsList(draft => {
            draft.splice(index, 1);
        });
    };

    // Show warehouse selection prompt if no warehouse selected
    if (!selectedWarehouse) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">مستند إصدار مواد</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            الرجاء اختيار المخزن للمتابعة في عملية الإصدار
                        </AlertDescription>
                    </Alert>
                    <WarehouseSelector />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">مستند إصدار مواد</CardTitle>
                    <div className="w-[300px]">
                        <WarehouseSelector />
                    </div>
                </div>
                <div className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                    المخزن المحدد: <span className="font-semibold">{selectedWarehouse.name}</span>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* --- HEADER FORM --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>اسم القسم</Label><Select onValueChange={setDepartment}><SelectTrigger><SelectValue placeholder="اختر القسم..." /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-2"><Label>اسم المستلم</Label><Input value={recipientName} onChange={e => setRecipientName(e.target.value)} /></div>
                    <div className="space-y-2"><Label>التاريخ</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className="w-full justify-start text-right font-normal"><CalendarIcon className="ml-2 h-4 w-4" />{date ? format(date, "PPP", { locale: ar }) : <span>اختر تاريخ</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent></Popover></div>
                    <div className="space-y-2"><Label>رقم المستند</Label><Input value={docNumber} onChange={e => setDocNumber(e.target.value)} /></div>
                    <div className="space-y-2 col-span-1 md:col-span-2"><Label>البيان أو الملاحظات العامة</Label><Textarea value={generalNotes} onChange={e => setGeneralNotes(e.target.value)} placeholder="اكتب ملاحظاتك هنا..." /></div>
                </div>

                {/* --- ITEMS TABLE --- */}
                <div className="border rounded-md">
                    <Table>
                        <TableHeader><TableRow><TableHead className="w-2/5">المادة</TableHead><TableHead>الوحدة</TableHead><TableHead>الكمية المطلوبة</TableHead><TableHead>ملاحظات</TableHead><TableHead>إجراء</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {itemsList.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Select onValueChange={value => handleItemChange(index, 'itemName', value)}>
                                            <SelectTrigger><SelectValue placeholder="اختر المادة..." /></SelectTrigger>
                                            <SelectContent>{items.map(i => <SelectItem key={i.id} value={i.name}>{i.name} ({i.code})</SelectItem>)}</SelectContent>
                                        </Select>
                                        {item.stock > 0 && <p className={`text-xs mt-1 ${item.quantity > item.stock ? 'text-red-500' : 'text-muted-foreground'}`}>الرصيد المتوفر: {item.stock}</p>}
                                    </TableCell>
                                    <TableCell><Input readOnly value={item.unit} className="w-24" /></TableCell>
                                    <TableCell><Input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-24" /></TableCell>
                                    <TableCell><Input value={item.notes || ''} onChange={e => handleItemChange(index, 'notes', e.target.value)} /></TableCell>
                                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="p-2 flex justify-start">
                        <Button variant="outline" size="sm" onClick={handleAddItem}><PlusCircle className="ml-2 h-4 w-4" /> إضافة سطر</Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">مستند جديد</Button>
                <Button>حفظ المستند</Button>
            </CardFooter>
        </Card>
    );
};

export default ItemIssuancePage;
