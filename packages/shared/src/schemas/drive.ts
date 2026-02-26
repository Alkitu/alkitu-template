import { z } from 'zod';

export const UploadFileSchema = z.object({
  name: z.string().min(1, 'File name is required'),
  data: z.string(), // Base64 encoded file data
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().positive('File size must be positive'),
});

export const EnhancedUploadSchema = z.object({
  folderId: z.string().min(1, 'Folder ID is required'),
  files: z
    .array(UploadFileSchema)
    .min(1, 'At least one file is required'),
});

export const InitResumableSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().positive('File size must be positive'),
  mimeType: z.string().min(1, 'MIME type is required'),
  folderId: z.string().min(1, 'Folder ID is required'),
  description: z.string().optional(),
});

// Type inference
export type UploadFileInput = z.infer<typeof UploadFileSchema>;
export type EnhancedUploadInput = z.infer<typeof EnhancedUploadSchema>;
export type InitResumableInput = z.infer<typeof InitResumableSchema>;
