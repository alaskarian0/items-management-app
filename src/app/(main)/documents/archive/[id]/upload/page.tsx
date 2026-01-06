"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  FileText,
  Image,
  File,
  X,
  Paperclip,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth/authStore";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// File upload interface
interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  category: string;
  description: string;
}

// Document info for display
interface DocumentInfo {
  docNumber: string;
  docType: string;
  requestNumber: string;
}

const MOCK_DOCUMENTS: Record<string, DocumentInfo> = {
  "1": {
    docNumber: "إدخ-2024-001",
    docType: "مستند إدخال - مشتريات",
    requestNumber: "إدخ-2024-001",
  },
  "2": {
    docNumber: "صرف-2024-001",
    docType: "مستند إصدار",
    requestNumber: "صرف-2024-001",
  },
  "3": {
    docNumber: "إدخ-2024-002",
    docType: "مستند إدخال - مشتريات",
    requestNumber: "إدخ-2024-002",
  },
  "4": {
    docNumber: "صرف-2024-002",
    docType: "مستند إصدار",
    requestNumber: "صرف-2024-002",
  },
  "5": {
    docNumber: "إدخ-2024-003",
    docType: "مستند إدخال - هدايا وندور",
    requestNumber: "إدخ-2024-003",
  },
  "6": {
    docNumber: "صرف-2024-003",
    docType: "مستند إصدار",
    requestNumber: "صرف-2024-003",
  },
  "7": {
    docNumber: "إدخ-2024-004",
    docType: "مستند إدخال - مشتريات",
    requestNumber: "إدخ-2024-004",
  },
  "8": {
    docNumber: "صرف-2024-004",
    docType: "مستند إصدار",
    requestNumber: "صرف-2024-004",
  },
  "9": {
    docNumber: "إدخ-2024-005",
    docType: "مستند إدخال - ارجاع مواد",
    requestNumber: "إدخ-2024-005",
  },
  "10": {
    docNumber: "صرف-2024-005",
    docType: "مستند إصدار",
    requestNumber: "صرف-2024-005",
  },
};

const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadDocumentsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Check permissions
  const hasAccess = user?.role === "admin" || user?.warehouse === "general";

  useEffect(() => {
    if (id && MOCK_DOCUMENTS[id]) {
      setDocument(MOCK_DOCUMENTS[id]);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles: UploadedFile[] = [];

    files.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`الملف ${file.name} أكبر من الحد المسموح (10MB)`);
        return;
      }

      // Check file type
      const fileType = file.type;
      if (!Object.keys(ACCEPTED_FILE_TYPES).includes(fileType)) {
        toast.error(`نوع الملف ${file.name} غير مدعوم`);
        return;
      }

      const uploadedFile: UploadedFile = {
        id: Math.random().toString(36).substring(7),
        file,
        category: "",
        description: "",
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          uploadedFile.preview = reader.result as string;
        };
        reader.readAsDataURL(file);
      }

      validFiles.push(uploadedFile);
    });

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    toast.success(`تم إضافة ${validFiles.length} ملف`);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    toast.info("تم إزالة الملف");
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, category } : f))
    );
  };

  const updateFileDescription = (fileId: string, description: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, description } : f))
    );
  };

  const handleUpload = async () => {
    // Validate all files have categories
    const missingCategory = uploadedFiles.some((f) => !f.category);
    if (missingCategory) {
      toast.error("الرجاء تحديد تصنيف لجميع الملفات");
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error("الرجاء إضافة ملف واحد على الأقل");
      return;
    }

    setIsUploading(true);

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      toast.success("تم رفع الملفات بنجاح");
      router.push(`/documents/archive/${id}`);
    }, 2000);

    // In production, upload files to server
    // const formData = new FormData();
    // uploadedFiles.forEach((uploadedFile, index) => {
    //   formData.append(`file_${index}`, uploadedFile.file);
    //   formData.append(`category_${index}`, uploadedFile.category);
    //   formData.append(`description_${index}`, uploadedFile.description);
    // });
  };

  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">غير مصرح</h3>
          <p className="text-muted-foreground mb-4">
            ليس لديك صلاحية رفع المرفقات
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
            <h2 className="text-3xl font-bold tracking-tight">
              رفع مرفقات المستند
            </h2>
            <p className="text-muted-foreground mt-1">
              رفع الملفات والصور المتعلقة بالمستند
            </p>
          </div>
        </div>
      </div>

      {/* Document Info */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات المستند</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">رقم المستند</p>
              <p className="font-mono font-semibold">{document.docNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">نوع المستند</p>
              <p className="font-medium">{document.docType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">رقم الطلب</p>
              <p className="font-mono font-medium">{document.requestNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Instructions */}
      <Alert>
        <Paperclip className="h-4 w-4" />
        <AlertDescription>
          <strong>أنواع الملفات المدعومة:</strong> PDF, JPG, PNG, WEBP, DOC,
          DOCX, XLS, XLSX
          <br />
          <strong>الحد الأقصى لحجم الملف:</strong> 10 ميجابايت
        </AlertDescription>
      </Alert>

      {/* Upload Zone */}
      <Card>
        <CardHeader>
          <CardTitle>رفع الملفات</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              اسحب وأفلت الملفات هنا أو انقر للتحديد
            </p>
            <p className="text-sm text-muted-foreground">
              يمكنك رفع عدة ملفات في نفس الوقت
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(",")}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              الملفات المرفوعة ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile) => (
                <Card key={uploadedFile.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* File Preview */}
                      <div className="flex-shrink-0">
                        {uploadedFile.preview ? (
                          <img
                            src={uploadedFile.preview}
                            alt={uploadedFile.file.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded">
                            {getFileIcon(uploadedFile.file.type)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{uploadedFile.file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(uploadedFile.file.size)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(uploadedFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>التصنيف *</Label>
                            <Select
                              value={uploadedFile.category}
                              onValueChange={(value) =>
                                updateFileCategory(uploadedFile.id, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="اختر التصنيف" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="invoice">فاتورة</SelectItem>
                                <SelectItem value="contract">عقد</SelectItem>
                                <SelectItem value="receipt">إيصال</SelectItem>
                                <SelectItem value="photo">صورة</SelectItem>
                                <SelectItem value="document">مستند</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>الوصف (اختياري)</Label>
                            <Input
                              placeholder="أدخل وصف للملف"
                              value={uploadedFile.description}
                              onChange={(e) =>
                                updateFileDescription(
                                  uploadedFile.id,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        <Button
          onClick={handleUpload}
          disabled={isUploading || uploadedFiles.length === 0}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري الرفع...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 ml-2" />
              رفع الملفات ({uploadedFiles.length})
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
