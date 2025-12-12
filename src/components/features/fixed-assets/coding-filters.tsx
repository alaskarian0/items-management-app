"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface CodingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: 'all' | 'coded' | 'pending';
  onFilterStatusChange: (value: 'all' | 'coded' | 'pending') => void;
}

export const CodingFilters = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange
}: CodingFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="البحث عن موجود (اسم، رقم تسلسلي، باركود)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
      </div>
      <div className="w-full md:w-48">
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger>
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="coded">مرمزة</SelectItem>
            <SelectItem value="pending">بانتظار الترميز</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
