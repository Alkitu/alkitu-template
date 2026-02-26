"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Plus,
  Upload,
  X,
  AlertTriangle,
  Edit2,
  Save,
  Check,
  FileText,
  Image,
  Video,
  Music,
  File,
  Trash2,
  RotateCcw,
  Loader2,
  Folder,
  Package,
  Target,
  UploadCloud,
  Rocket,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Progress } from "@ui/progress";
import { Badge } from "@ui/badge";
import { Alert, AlertDescription } from "@ui/alert";
import { cn } from "@/lib/utils";
import { useTranslations } from '@/context/TranslationsContext';

// Types
export type UploadStatus = "pending" | "uploading" | "completed" | "error";

export interface UploadFileItem {
  id: string;
  file: File;
  originalName: string;
  newName: string;
  status: UploadStatus;
  progress: number;
  error?: string;
  driveFileId?: string;
}

interface EnhancedDropZoneProps {
  folderId: string;
  folderName: string;
  className?: string;
  disabled?: boolean;
  onUploadComplete?: (files: UploadFileItem[]) => void;
  onFileUploaded?: (driveFile: Record<string, unknown>) => void;
  allowedRoles?: string[];
  userRole?: string;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1GB
const WARN_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const RESUMABLE_THRESHOLD = 3 * 1024 * 1024; // 3MB (Vercel proxy limit)

// Utility functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(file: File) {
  const type = file.type.toLowerCase();
  if (type.startsWith("image/")) return <Image className='w-4 h-4' />;
  if (type.startsWith("video/")) return <Video className='w-4 h-4' />;
  if (type.startsWith("audio/")) return <Music className='w-4 h-4' />;
  if (type.includes("pdf") || type.includes("document"))
    return <FileText className='w-4 h-4' />;
  return <File className='w-4 h-4' />;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

export function EnhancedDropZone({
  folderId,
  folderName,
  className,
  disabled = false,
  onUploadComplete,
  onFileUploaded,
  allowedRoles,
  userRole,
}: EnhancedDropZoneProps) {
  const t = useTranslations('media');
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<UploadFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef<AbortController | null>(null);

  // Validation
  const validateFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(
          `${file.name} ${t('upload.tooLarge')} (${formatFileSize(
            file.size
          )}). ${t('upload.maxSize')}`
        );
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(`${t('upload.someExcluded')}\n\n${errors.join("\n")}`);
    }

    return validFiles;
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled || isUploading) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(droppedFiles);

      if (validFiles.length > 0) {
        addFiles(validFiles);
      }
    },
    [disabled, isUploading, validateFiles]
  );

  // File input handler
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || isUploading) return;

      const selectedFiles = Array.from(e.target.files || []);
      const validFiles = validateFiles(selectedFiles);

      if (validFiles.length > 0) {
        addFiles(validFiles);
      }
    },
    [disabled, isUploading, validateFiles]
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, isUploading]);

  // File management
  const addFiles = useCallback((newFiles: File[]) => {
    const uploadFiles: UploadFileItem[] = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      originalName: file.name,
      newName: file.name,
      status: "pending" as UploadStatus,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const removeFile = useCallback(
    (fileId: string) => {
      if (isUploading) return;
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    },
    [isUploading]
  );

  const clearAllFiles = useCallback(() => {
    if (isUploading) return;
    setFiles([]);
  }, [isUploading]);

  const retryFile = useCallback(
    (fileId: string) => {
      if (isUploading) return;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "pending" as UploadStatus,
                progress: 0,
                error: undefined,
              }
            : f
        )
      );
    },
    [isUploading]
  );

  // Name editing
  const startEditing = useCallback((file: UploadFileItem) => {
    if (file.status === "uploading" || file.status === "completed") return;
    setEditingFileId(file.id);
    setTempName(file.newName);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editingFileId || !tempName.trim()) return;

    setFiles((prev) =>
      prev.map((f) =>
        f.id === editingFileId ? { ...f, newName: tempName.trim() } : f
      )
    );
    setEditingFileId(null);
    setTempName("");
  }, [editingFileId, tempName]);

  const cancelEdit = useCallback(() => {
    setEditingFileId(null);
    setTempName("");
  }, []);

  // Upload functionality
  const updateProgress = useCallback((fileId: string, progress: number) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
      )
    );
  }, []);

  const uploadFileResumable = async (
    fileItem: UploadFileItem,
    signal: AbortSignal
  ): Promise<void> => {
    try {
      updateProgress(fileItem.id, 5);

      const initResponse = await fetch("/api/drive/upload/init-resumable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileItem.newName.trim(),
          fileSize: fileItem.file.size,
          mimeType: fileItem.file.type || "application/octet-stream",
          folderId: folderId,
        }),
        signal,
      });

      if (!initResponse.ok) {
        throw new Error(
          `Failed to initialize resumable upload: ${initResponse.statusText}`
        );
      }

      const { resumableURI } = await initResponse.json();
      updateProgress(fileItem.id, 10);

      const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(fileItem.file.size / CHUNK_SIZE);
      let uploadedBytes = 0;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        if (signal.aborted) throw new Error("Upload cancelled");

        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileItem.file.size);
        const chunk = fileItem.file.slice(start, end);

        const chunkResponse = await fetch(
          `/api/drive/upload/resumable-chunk?resumableURI=${encodeURIComponent(resumableURI)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/octet-stream",
              "Content-Range": `bytes ${start}-${end - 1}/${fileItem.file.size}`,
            },
            body: chunk,
            signal,
          }
        );

        if (!chunkResponse.ok && chunkResponse.status !== 308) {
          throw new Error(`Chunk upload failed: ${chunkResponse.statusText}`);
        }

        uploadedBytes += chunk.size;
        const progress =
          10 + Math.floor((uploadedBytes / fileItem.file.size) * 85);
        updateProgress(fileItem.id, progress);

        if (chunkResponse.status !== 308) {
          const finalData = await chunkResponse.json().catch(() => ({}));
          if (finalData?.file) {
            onFileUploaded?.(finalData.file);
          }
          break;
        }
      }

      updateProgress(fileItem.id, 100);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: "completed" as UploadStatus, progress: 100 }
            : f
        )
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? {
                ...f,
                status: "error" as UploadStatus,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
      throw error;
    }
  };

  const uploadSingleFile = async (
    fileItem: UploadFileItem,
    signal: AbortSignal
  ): Promise<void> => {
    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: "uploading" as UploadStatus, progress: 0 }
            : f
        )
      );

      updateProgress(fileItem.id, 10);

      if (signal.aborted) throw new Error("Upload cancelled");

      const isLargeFile = fileItem.file.size > WARN_FILE_SIZE;
      const shouldUseResumable = fileItem.file.size > RESUMABLE_THRESHOLD;

      if (shouldUseResumable) {
        await uploadFileResumable(fileItem, signal);
        return;
      }

      updateProgress(fileItem.id, 20);
      const base64Data = await fileToBase64(fileItem.file);
      updateProgress(fileItem.id, isLargeFile ? 40 : 60);

      if (signal.aborted) throw new Error("Upload cancelled");

      const mimeType = fileItem.file.type || "application/octet-stream";
      const fileSize = Number(fileItem.file.size);

      if (!fileItem.newName.trim()) {
        throw new Error("File name is required");
      }

      const payload = {
        folderId,
        files: [
          {
            name: fileItem.newName.trim(),
            data: base64Data,
            mimeType: mimeType,
            size: fileSize,
          },
        ],
      };

      updateProgress(fileItem.id, isLargeFile ? 50 : 70);

      const response = await fetch("/api/drive/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
      });

      updateProgress(fileItem.id, isLargeFile ? 80 : 90);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }

        let errorMessage =
          errorData.error ||
          errorData.details ||
          `HTTP ${response.status}: Upload failed`;

        if (response.status === 413) {
          errorMessage = `${t('upload.tooLargeServer')} (${(
            fileSize /
            (1024 * 1024)
          ).toFixed(1)}MB)`;
        } else if (response.status === 408 || response.status === 504) {
          errorMessage = t('upload.timeoutError');
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].error);
      }

      const uploadedFile = result.uploadedFiles?.[0]?.file;

      if (uploadedFile) {
        onFileUploaded?.(uploadedFile);
      }

      updateProgress(fileItem.id, 100);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? {
                ...f,
                status: "completed" as UploadStatus,
                progress: 100,
                driveFileId: uploadedFile?.id,
              }
            : f
        )
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: "pending" as UploadStatus, progress: 0 }
              : f
          )
        );
        return;
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? {
                ...f,
                status: "error" as UploadStatus,
                progress: 0,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  const startUpload = useCallback(async () => {
    const pendingFiles = files.filter((file) => file.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    abortController.current = new AbortController();

    try {
      for (const file of pendingFiles) {
        if (abortController.current.signal.aborted) break;
        await uploadSingleFile(file, abortController.current.signal);
      }

      if (onUploadComplete) {
        const completedFiles = files.filter((f) => f.status === "completed");
        onUploadComplete(completedFiles);
      }
    } catch (error) {
      console.error("Upload batch error:", error);
    } finally {
      setIsUploading(false);
      abortController.current = null;
    }
  }, [files, folderId, onUploadComplete]);

  const cancelUpload = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    setIsUploading(false);

    setFiles((prev) =>
      prev.map((file) =>
        file.status === "uploading"
          ? { ...file, status: "pending" as UploadStatus, progress: 0 }
          : file
      )
    );
  }, []);

  // Status indicators
  const getStatusBadge = (status: UploadStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className='bg-muted text-muted-foreground hover:text-background'>
            {t('upload.statusPending')}
          </Badge>
        );
      case "uploading":
        return (
          <Badge className='bg-primary text-primary-foreground'>
            <Loader2 className='w-3 h-3 mr-1 animate-spin' />
            {t('upload.statusUploading')}
          </Badge>
        );
      case "completed":
        return (
          <Badge className='bg-success text-success-foreground'>
            <Check className='w-3 h-3 mr-1' />
            {t('upload.statusCompleted')}
          </Badge>
        );
      case "error":
        return (
          <Badge className='bg-destructive text-destructive-foreground'>
            {t('upload.statusError')}
          </Badge>
        );
      default:
        return null;
    }
  };

  // Statistics
  const totalFiles = files.length;
  const pendingFiles = files.filter((f) => f.status === "pending").length;
  const completedFiles = files.filter((f) => f.status === "completed").length;
  const errorFiles = files.filter((f) => f.status === "error").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;

  const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
  const hasLargeFiles = files.some((file) => file.file.size > WARN_FILE_SIZE);
  const hasErrors = errorFiles > 0;
  const canUpload = pendingFiles > 0 && !isUploading;
  const isCompleted = totalFiles > 0 && completedFiles === totalFiles;

  // Check authorization via allowedRoles prop
  if (allowedRoles && allowedRoles.length > 0 && userRole) {
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className='border-2 border-dashed border-primary rounded-lg p-8 text-center'>
          <Upload className='h-12 w-12 mx-auto mb-4' />
          <p>{t('upload.noPermission')}</p>
        </div>
      );
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg transition-all duration-300",
          isDragOver
            ? "border-primary bg-primary/10 shadow-lg"
            : files.length > 0
              ? "border-zinc-300 bg-background"
              : "border-zinc-300 hover:border-primary/50 hover:bg-primary/5 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "border-background bg-background/95"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={files.length === 0 ? handleClick : undefined}
      >
        {files.length === 0 ? (
          // Empty state
          <div className='p-4 sm:p-8 lg:p-16 text-center bg-background hover:bg-background/95 transition-colors duration-300'>
            {isDragOver ? (
              <div className='text-foreground'>
                <div className='p-4 sm:p-6 rounded-full bg-primary mx-auto mb-4 sm:mb-6 w-fit shadow-lg scale-110 transition-all duration-300'>
                  <Upload className='h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground' />
                </div>
                <h4 className='text-lg sm:text-xl font-bold mb-3'>
                  {t('upload.dropHere')}
                </h4>
                <p className='text-sm sm:text-base font-medium text-muted-foreground'>
                  {t('upload.readyToReceive')} {folderName}
                </p>
              </div>
            ) : (
              <div className='text-muted-foreground'>
                <div className='p-4 sm:p-6 rounded-full bg-muted mx-auto mb-4 sm:mb-6 w-fit hover:bg-muted/80 transition-colors duration-300'>
                  <Plus className='h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground' />
                </div>
                <h4 className='text-lg sm:text-xl font-bold mb-3 text-foreground'>
                  {t('upload.uploadFiles')}
                </h4>
                <p className='text-sm sm:text-base font-medium text-muted-foreground mb-4 leading-relaxed px-4'>
                  {t('upload.dragOrClick')}
                </p>
                <div className='bg-muted rounded-lg px-3 py-2 mb-3 inline-block max-w-full'>
                  <p className='text-xs sm:text-sm font-semibold text-muted-foreground flex items-center gap-2'>
                    <Folder className='h-3 w-3 sm:h-4 sm:w-4' />
                    {t('upload.destination')}:{" "}
                    <span className='text-foreground font-bold break-words'>
                      {folderName}
                    </span>
                  </p>
                </div>
                <div className='text-xs sm:text-sm font-medium text-muted-foreground space-y-2'>
                  <div className='flex flex-wrap gap-2 justify-center'>
                    <div className='bg-primary/10 px-2 py-1 rounded text-primary flex items-center gap-2'>
                      <Folder className='h-3 w-3' />
                      {t('upload.maxPerFile')}
                    </div>
                    <div className='bg-primary/10 px-2 py-1 rounded text-primary flex items-center gap-2'>
                      <Rocket className='h-3 w-3' />
                      {t('upload.resumableHint')}
                    </div>
                    <div className='bg-primary/10 px-2 py-1 rounded text-primary flex items-center gap-2'>
                      <Target className='h-3 w-3' />
                      {t('upload.allFormats')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Files present state
          <div className='p-3 sm:p-6'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 sm:p-3 rounded-lg bg-primary/10'>
                  <Upload className='h-4 w-4 sm:h-5 sm:w-5 text-primary' />
                </div>
                <h3 className='text-base sm:text-lg font-bold text-foreground'>
                  {t('upload.filesToUpload')} ({totalFiles})
                </h3>
              </div>
              <div className='flex items-center gap-2 sm:gap-3 w-full sm:w-auto'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClick}
                  disabled={isUploading}
                  className='flex-1 sm:flex-none border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  <span className='hidden sm:inline'>{t('upload.addMore')}</span>
                  <span className='sm:hidden'>{t('upload.more')}</span>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={clearAllFiles}
                  disabled={isUploading}
                  className='flex-1 sm:flex-none text-muted-foreground border-border hover:bg-muted font-medium'
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  <span className='hidden sm:inline'>{t('upload.clearAll')}</span>
                  <span className='sm:hidden'>{t('upload.clear')}</span>
                </Button>
              </div>
            </div>

            {/* Summary info */}
            <div className='text-sm font-medium text-muted-foreground mb-6 p-3 sm:p-4 bg-muted/30 rounded-lg border border-border'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 w-full sm:w-auto'>
                  <span className='bg-background px-3 py-1 rounded-md border border-border font-semibold text-foreground'>
                    <strong>{t('upload.total')}:</strong> {formatFileSize(totalSize)}
                  </span>
                  <span className='bg-background px-3 py-1 rounded-md border border-border font-semibold text-foreground truncate max-w-full sm:max-w-none'>
                    <strong>{t('upload.destination')}:</strong>{" "}
                    <span className='break-words'>{folderName}</span>
                  </span>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                  {pendingFiles > 0 && (
                    <Badge variant='secondary'>{pendingFiles} {t('upload.pending')}</Badge>
                  )}
                  {uploadingFiles > 0 && (
                    <Badge variant='secondary'>{uploadingFiles} {t('upload.uploading')}</Badge>
                  )}
                  {completedFiles > 0 && (
                    <Badge className='bg-success text-success-foreground font-medium'>
                      {completedFiles} {t('upload.completed')}
                    </Badge>
                  )}
                  {errorFiles > 0 && (
                    <Badge className='bg-destructive text-destructive-foreground font-medium'>
                      {errorFiles} {t('upload.withError')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Warnings */}
            {hasLargeFiles && (
              <Alert className='mb-4 border-warning bg-warning/10 text-warning'>
                <AlertTriangle className='h-5 w-5 stroke-warning' />
                <AlertDescription className='text-warning font-medium'>
                  <strong>{t('upload.largeFilesWarning')}</strong> {t('upload.largeFilesHint')}
                </AlertDescription>
              </Alert>
            )}

            {hasErrors && (
              <Alert
                variant='destructive'
                className='mb-4 border-destructive bg-destructive/10 text-destructive'
              >
                <AlertTriangle className='h-5 w-5 stroke-destructive' />
                <AlertDescription className='text-destructive font-medium'>
                  <strong className='flex items-center gap-2'>
                    <XCircle className='h-4 w-4' />
                    {errorFiles} {t('upload.filesFailed')}
                  </strong>{" "}
                  {t('upload.retryOrRemove')}
                </AlertDescription>
              </Alert>
            )}

            {isCompleted && !hasErrors && (
              <Alert className='mb-4 border-success bg-success/10 text-success'>
                <Check className='h-5 w-5 stroke-success' />
                <AlertDescription className='text-success font-medium'>
                  <strong className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4' />
                    {t('upload.allUploaded')}
                  </strong>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className='space-y-4 w-full'>
          <div
            className='h-96 w-full border border-border rounded-lg p-2 bg-background overflow-y-auto overflow-x-hidden'
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--primary) var(--primary-foreground)",
            }}
          >
            <div className='space-y-3'>
              {files.map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "border rounded-xl p-3 sm:p-5 transition-all duration-200 shadow-sm",
                    file.status === "error" &&
                      "border-destructive bg-destructive/10",
                    file.status === "completed" &&
                      "border-success bg-success/10",
                    file.status === "uploading" &&
                      "border-warning/40 bg-warning/8",
                    file.status === "pending" &&
                      "border-border bg-background hover:border-background/90 hover:bg-background/90 hover:shadow-md"
                  )}
                >
                  {/* File header */}
                  <div className='flex flex-col gap-3 mb-4'>
                    <div className='flex items-start gap-3 min-w-0'>
                      <div className='p-2 bg-primary/10 flex-shrink-0'>
                        <div className='text-primary stroke-primary'>
                          {getFileIcon(file.file)}
                        </div>
                      </div>
                      <div className='flex-1 min-w-0 overflow-hidden'>
                        <div className='font-semibold text-sm sm:text-base text-foreground mb-1 break-all line-clamp-2'>
                          {file.originalName}
                        </div>
                        <div className='flex flex-wrap items-center gap-2 mt-1'>
                          <span className='text-xs sm:text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded whitespace-nowrap'>
                            {formatFileSize(file.file.size)}
                          </span>
                          {file.file.size > RESUMABLE_THRESHOLD && (
                            <Badge
                              variant='secondary'
                              className='flex items-center gap-1 text-xs whitespace-nowrap'
                            >
                              <Rocket className='h-3 w-3' />
                              {t('upload.resumable')}
                            </Badge>
                          )}
                          {file.file.size > WARN_FILE_SIZE &&
                            file.file.size <= RESUMABLE_THRESHOLD && (
                              <Badge className='bg-warning text-warning-foreground font-medium flex items-center gap-1 text-xs whitespace-nowrap'>
                                <Package className='h-3 w-3' />
                                {t('upload.large')}
                              </Badge>
                            )}
                        </div>
                      </div>
                    </div>
                    {/* Action buttons row */}
                    <div className='flex items-center justify-between flex-wrap gap-2'>
                      <div className='flex items-center gap-2'>
                        {getStatusBadge(file.status)}
                      </div>
                      <div className='flex items-center gap-2 flex-wrap'>
                        {file.status === "error" && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => retryFile(file.id)}
                            className='text-primary border-primary hover:bg-primary hover:text-black font-medium text-xs sm:text-sm'
                          >
                            <RotateCcw className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
                            {t('upload.retry')}
                          </Button>
                        )}
                        {(file.status === "pending" ||
                          file.status === "error") && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => removeFile(file.id)}
                            className='text-destructive border-destructive hover:text-background hover:bg-destructive/90 transition-colors duration-300 hover:border-destructive font-medium text-xs sm:text-sm'
                          >
                            <X className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
                            {t('upload.remove')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name editing */}
                  {(file.status === "pending" || file.status === "error") && (
                    <div className='mb-4'>
                      <label className='text-sm font-semibold text-foreground block mb-2'>
                        {t('upload.nameInDrive')}
                      </label>
                      {editingFileId === file.id ? (
                        <div className='flex gap-2'>
                          <Input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className='text-sm border-primary focus:border-primary font-medium'
                            placeholder={t('upload.fileNamePlaceholder')}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            autoFocus
                          />
                          <Button
                            size='sm'
                            onClick={saveEdit}
                            disabled={!tempName.trim()}
                            className='bg-primary text-black hover:bg-primary/90 font-medium'
                          >
                            <Save className='w-4 h-4 mr-1' />
                            {t('upload.save')}
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={cancelEdit}
                            className='border-zinc-400 text-zinc-700 hover:bg-zinc-100 font-medium'
                          >
                            <X className='w-4 h-4' />
                          </Button>
                        </div>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <Input
                            value={file.newName}
                            readOnly
                            className='text-sm bg-zinc-100 border-zinc-300 font-medium text-zinc-800'
                          />
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => startEditing(file)}
                            className='border-primary text-primary hover:bg-primary hover:text-black font-medium'
                          >
                            <Edit2 className='w-4 h-4 mr-1' />
                            {t('upload.edit')}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Progress bar */}
                  {file.status === "uploading" && (
                    <div className='mb-4'>
                      <div className='flex justify-between text-sm mb-2'>
                        <span className='font-semibold text-foreground flex items-center gap-2'>
                          <UploadCloud className='h-4 w-4' />
                          {t('upload.uploadingFile')}
                        </span>
                        <span className='font-bold text-primary'>
                          {file.progress}%
                        </span>
                      </div>
                      <Progress
                        value={file.progress}
                        className='h-3 bg-zinc-200'
                      />
                    </div>
                  )}

                  {/* Error message */}
                  {file.status === "error" && file.error && (
                    <Alert
                      variant='destructive'
                      className='mb-2 border-destructive bg-destructive/20'
                    >
                      <AlertTriangle className='h-4 w-4 text-destructive' />
                      <AlertDescription className='text-sm font-medium text-destructive-foreground flex items-center gap-2'>
                        <XCircle className='h-4 w-4' />
                        <strong>Error:</strong> {file.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Success info */}
                  {file.status === "completed" && file.driveFileId && (
                    <div className='text-sm font-medium text-success-foreground bg-success/20 p-3 rounded-lg border border-success flex items-center gap-2'>
                      <CheckCircle className='h-4 w-4' />
                      <strong>{t('upload.uploadedSuccessfully')}</strong> • ID:{" "}
                      <code className='bg-success/30 px-1 rounded'>
                        {file.driveFileId}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex bg-background justify-between items-center pt-6 border-t px-6 py-4 rounded-xl'>
            <div className='text-base font-medium text-zinc-700'>
              {isUploading ? (
                <span className='flex items-center gap-3 font-semibold'>
                  <Loader2 className='h-5 w-5 animate-spin text-primary' />
                  <span className='text-foreground'>{t('upload.uploadingFile')}</span>
                </span>
              ) : isCompleted ? (
                <span className='text-foreground font-bold flex items-center gap-2'>
                  <Check className='h-5 w-5' />
                  {t('upload.uploadComplete')}
                </span>
              ) : (
                <span className='text-primary'>
                  <strong className='text-primary'>{pendingFiles}</strong>{" "}
                  {t('upload.filesReady')}
                </span>
              )}
            </div>
            <div className='flex gap-3'>
              {isUploading && (
                <Button
                  variant='destructive'
                  onClick={cancelUpload}
                  className='bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold'
                >
                  <X className='h-4 w-4 mr-2' />
                  {t('upload.cancelUpload')}
                </Button>
              )}
              {canUpload && (
                <Button
                  onClick={startUpload}
                  className='bg-primary text-black hover:bg-primary/90 border-primary font-semibold shadow-md'
                >
                  <Upload className='h-4 w-4 mr-2' />
                  {t('upload.uploadCount').replace('{count}', String(pendingFiles))}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        onChange={handleFileChange}
        className='hidden'
        disabled={disabled}
        accept='image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
      />
    </div>
  );
}
