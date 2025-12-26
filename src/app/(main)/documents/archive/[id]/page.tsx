"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Image,
  File,
  Calendar,
  User,
  Package,
  Download,
  Eye,
  Paperclip,
  AlertCircle,
  Upload,
  Plus,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";

// Attachment interface
interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  url: string;
}

// Archived Document Detail interface
interface ArchivedDocumentDetail {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: "invoice" | "contract" | "receipt" | "report" | "other";
  requestNumber: string;
  warehouseName: string;
  uploadedBy: string;
  uploadedDate: string;
  tags: string[];
  notes?: string;
  description?: string;
  attachments: Attachment[];
}

// Mock data for document details
const MOCK_DOCUMENT_DETAILS: Record<string, ArchivedDocumentDetail> = {
  "1": {
    id: "1",
    fileName: "فاتورة_شراء_مكاتب_2024_001.pdf",
    fileType: "application/pdf",
    fileSize: 245678,
    category: "invoice",
    requestNumber: "SR-2024-001",
    warehouseName: "مخزن الأثاث والممتلكات العامة",
    uploadedBy: "أحمد محمد - مخزن المواد العامة",
    uploadedDate: "2024-01-20",
    tags: ["أثاث", "مكاتب", "2024"],
    notes: "فاتورة شراء مكاتب للمكاتب الجديدة",
    description:
      "فاتورة شراء خاصة بتوريد 5 مكاتب خشبية و5 كراسي دوارة و3 خزائن ملفات للمكاتب الجديدة في القسم الإداري",
    attachments: [
      {
        id: "att1",
        fileName: "فاتورة_المورد_الأصلية.pdf",
        fileType: "application/pdf",
        fileSize: 456789,
        uploadedAt: "2024-01-20",
        url: "#",
      },
      {
        id: "att2",
        fileName: "صورة_المكاتب_المستلمة.jpg",
        fileType: "image/jpeg",
        fileSize: 2345678,
        uploadedAt: "2024-01-20",
        url: "#",
      },
      {
        id: "att3",
        fileName: "إيصال_الاستلام.pdf",
        fileType: "application/pdf",
        fileSize: 123456,
        uploadedAt: "2024-01-20",
        url: "#",
      },
    ],
  },
  "2": {
    id: "2",
    fileName: "عقد_توريد_ورق_A4.pdf",
    fileType: "application/pdf",
    fileSize: 512340,
    category: "contract",
    requestNumber: "SR-2024-002",
    warehouseName: "مخزن المواد العامة",
    uploadedBy: "سارة علي - مخزن المواد العامة",
    uploadedDate: "2024-01-18",
    tags: ["قرطاسية", "ورق", "عقد"],
    notes: "عقد توريد ورق A4 للعام 2024",
    description: "عقد توريد سنوي لتوريد ورق A4 للمخزن العام بمواصفات محددة",
    attachments: [
      {
        id: "att1",
        fileName: "العقد_الموقع.pdf",
        fileType: "application/pdf",
        fileSize: 678901,
        uploadedAt: "2024-01-18",
        url: "#",
      },
      {
        id: "att2",
        fileName: "المواصفات_الفنية.docx",
        fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: 234567,
        uploadedAt: "2024-01-18",
        url: "#",
      },
    ],
  },
  "3": {
    id: "3",
    fileName: "صورة_شحنة_وقود.jpg",
    fileType: "image/jpeg",
    fileSize: 1234567,
    category: "receipt",
    requestNumber: "SR-2024-004",
    warehouseName: "مخزن الوقود والزيوت",
    uploadedBy: "محمد حسن - مخزن المواد العامة",
    uploadedDate: "2024-01-10",
    tags: ["وقود", "شحنة", "استلام"],
    description: "صور شحنة وقود مستلمة من المورد الرئيسي",
    attachments: [
      {
        id: "att1",
        fileName: "صورة_الشحنة_1.jpg",
        fileType: "image/jpeg",
        fileSize: 1567890,
        uploadedAt: "2024-01-10",
        url: "#",
      },
      {
        id: "att2",
        fileName: "صورة_الشحنة_2.jpg",
        fileType: "image/jpeg",
        fileSize: 1423456,
        uploadedAt: "2024-01-10",
        url: "#",
      },
      {
        id: "att3",
        fileName: "بوليصة_الشحن.pdf",
        fileType: "application/pdf",
        fileSize: 345678,
        uploadedAt: "2024-01-10",
        url: "#",
      },
    ],
  },
};

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuthStore();
  const [document, setDocument] = useState<ArchivedDocumentDetail | null>(null);

  // Check permissions
  const hasAccess = user?.role === "admin" || user?.warehouse === "general";

  useEffect(() => {
    // In real app, fetch from API/database
    if (id && MOCK_DOCUMENT_DETAILS[id]) {
      setDocument(MOCK_DOCUMENT_DETAILS[id]);
    }
  }, [id]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-600" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      invoice: "bg-green-500/10 text-green-700 hover:bg-green-500/20",
      contract: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
      receipt: "bg-purple-500/10 text-purple-700 hover:bg-purple-500/20",
      report: "bg-orange-500/10 text-orange-700 hover:bg-orange-500/20",
      other: "bg-gray-500/10 text-gray-700 hover:bg-gray-500/20",
    };

    const labels: Record<string, string> = {
      invoice: "فاتورة",
      contract: "عقد",
      receipt: "إيصال",
      report: "تقرير",
      other: "أخرى",
    };

    return (
      <Badge className={colors[category] || colors.other}>
        {labels[category] || category}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleDownload = (fileName: string) => {
    // In production, would download from server
    console.log("Downloading:", fileName);
  };

  const handleView = (fileName: string) => {
    // In production, would open in viewer
    console.log("Viewing:", fileName);
  };

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">غير مصرح</h3>
          <p className="text-muted-foreground mb-4">
            ليس لديك صلاحية الوصول إلى هذا المستند
          </p>
          <Button onClick={() => router.back()}>العودة</Button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">المستند غير موجود</h3>
          <p className="text-muted-foreground mb-4">
            لم يتم العثور على المستند المطلوب
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">تفاصيل المستند</h2>
            <p className="text-muted-foreground mt-1">
              عرض تفاصيل المستند والمرفقات
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleView(document.fileName)}>
            <Eye className="h-4 w-4 ml-2" />
            عرض
          </Button>
          <Button onClick={() => handleDownload(document.fileName)}>
            <Download className="h-4 w-4 ml-2" />
            تحميل
          </Button>
        </div>
      </div>

      {/* Document Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getFileIcon(document.fileType)}
              معلومات المستند
            </CardTitle>
            {getCategoryBadge(document.category)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">اسم الملف</p>
                <p className="font-semibold text-lg">{document.fileName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">رقم الطلب</p>
                <p className="font-mono font-medium">{document.requestNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">المخزن</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{document.warehouseName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">الحجم</p>
                <p className="font-medium">{formatFileSize(document.fileSize)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">رفع بواسطة</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{document.uploadedBy}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">تاريخ الرفع</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">
                    {new Date(document.uploadedDate).toLocaleDateString("ar-IQ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">الوسوم</p>
                <div className="flex flex-wrap gap-1">
                  {document.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {document.description && (
            <>
              <Separator className="my-6" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">الوصف</p>
                <p className="text-base leading-relaxed bg-muted/50 p-4 rounded-md">
                  {document.description}
                </p>
              </div>
            </>
          )}

          {document.notes && (
            <>
              <Separator className="my-6" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">ملاحظات</p>
                <p className="text-base leading-relaxed bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
                  {document.notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              المرفقات ({document.attachments.length})
            </CardTitle>
            <Button onClick={() => router.push(`/documents/archive/${id}/upload`)}>
              <Upload className="h-4 w-4 ml-2" />
              رفع مرفقات جديدة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {document.attachments.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-muted p-6">
                  <Paperclip className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    لا توجد مرفقات لهذا المستند
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    قم برفع الملفات والصور المتعلقة بهذا المستند
                  </p>
                  <Button onClick={() => router.push(`/documents/archive/${id}/upload`)}>
                    <Plus className="h-4 w-4 ml-2" />
                    رفع مرفقات
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {document.attachments.map((attachment) => (
                <Card key={attachment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(attachment.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {attachment.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attachment.uploadedAt).toLocaleDateString("ar-IQ")}
                        </p>
                        <div className="flex gap-1 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleView(attachment.fileName)}
                          >
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-7"
                            onClick={() => handleDownload(attachment.fileName)}
                          >
                            <Download className="h-3 w-3 ml-1" />
                            تحميل
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة للقائمة
        </Button>
        <Button onClick={() => handleDownload(document.fileName)}>
          <Download className="h-4 w-4 ml-2" />
          تحميل المستند الرئيسي
        </Button>
      </div>
    </div>
  );
}
