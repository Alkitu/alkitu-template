"use client";

import React from "react";
import { EnhancedDropZone } from "./EnhancedDropZone";
import { Button } from "@ui/button";
import { ExternalLink } from "lucide-react";
import type { UploadFileItem } from "./EnhancedDropZone";

interface DirectFileUploadManagerProps {
  folderId: string;
  folderName: string;
  className?: string;
  disabled?: boolean;
  onUploadComplete?: (files: UploadFileItem[]) => void;
  allowedRoles?: string[];
  userRole?: string;
}

export function DirectFileUploadManager({
  folderId,
  folderName,
  className,
  disabled = false,
  onUploadComplete,
  allowedRoles,
  userRole,
}: DirectFileUploadManagerProps) {
  const openInDrive = () => {
    const driveUrl = `https://drive.google.com/drive/folders/${folderId}`;
    window.open(driveUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={className}>
      <div className='flex justify-end mb-3'>
        <Button
          onClick={openInDrive}
          variant='outline'
          size='sm'
          className='text-primary border-background hover:text-primary-foreground hover:bg-primary hover:border-primary transition-colors'
        >
          <ExternalLink className='w-4 h-4 mr-2' />
          Abrir en Drive
        </Button>
      </div>

      <EnhancedDropZone
        folderId={folderId}
        folderName={folderName}
        disabled={disabled}
        onUploadComplete={onUploadComplete}
        allowedRoles={allowedRoles}
        userRole={userRole}
      />
    </div>
  );
}
