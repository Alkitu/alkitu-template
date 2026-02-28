export interface ImagePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called with the final image URL (upload result, pasted URL, or Drive thumbnail) */
  onImageSelected: (url: string) => void;
  /** Upload handler — receives a compressed File and returns the public URL */
  onImageUpload?: (file: File) => Promise<string>;
  /** Root folder ID for Drive browsing. Falls back to NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID */
  driveFolderId?: string;
}

export interface ImagePickerContentProps {
  /** Called with the final image URL (upload result, pasted URL, or Drive thumbnail) */
  onImageSelected: (url: string) => void;
  /** Called when the user wants to dismiss/close the picker */
  onDismiss: () => void;
  /** Upload handler — receives a compressed File and returns the public URL */
  onImageUpload?: (file: File) => Promise<string>;
  /** Root folder ID for Drive browsing. Falls back to NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID */
  driveFolderId?: string;
  /** When false, resets internal state (used for modal open/close or tab visibility) */
  isVisible?: boolean;
}
