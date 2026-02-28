'use client';

import type { ImagePickerModalProps } from './ImagePickerModal.types';
import { ResponsiveModal } from '@/components/primitives/ui/responsive-modal';
import { ImagePickerContent } from './ImagePickerContent';
import { useTranslations } from '@/context/TranslationsContext';

/**
 * ImagePickerModal - Molecule
 *
 * Modal wrapper around ImagePickerContent.
 * Provides the same 3-tab experience (Upload / URL / Drive) inside a ResponsiveModal.
 */
export function ImagePickerModal({
  open,
  onOpenChange,
  onImageSelected,
  onImageUpload,
  driveFolderId,
}: ImagePickerModalProps) {
  const t = useTranslations('imagePicker');

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={t('description')}
      contentClassName="sm:max-w-[600px]"
    >
      <ImagePickerContent
        onImageSelected={onImageSelected}
        onDismiss={() => onOpenChange(false)}
        onImageUpload={onImageUpload}
        driveFolderId={driveFolderId}
        isVisible={open}
      />
    </ResponsiveModal>
  );
}
