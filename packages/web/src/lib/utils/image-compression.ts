/**
 * WebP Image Compression Utility
 *
 * Uses native Canvas API for browser-based image compression to WebP format.
 * Zero external dependencies.
 */

/** Options for WebP compression */
interface CompressOptions {
  /** WebP quality (0-1). Default: 0.85 */
  quality?: number;
  /** Max width in pixels. Default: 4096 */
  maxWidth?: number;
  /** Max height in pixels. Default: 4096 */
  maxHeight?: number;
}

/** MIME types that can be compressed to WebP */
const COMPRESSIBLE_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/tiff',
  'image/webp',
];

/**
 * Check if a file is an image that can be compressed to WebP.
 * SVGs and GIFs are excluded (vector/animation).
 */
export function isCompressibleImage(file: File): boolean {
  return COMPRESSIBLE_IMAGE_TYPES.includes(file.type);
}

/**
 * Check if the browser supports WebP encoding via Canvas.
 */
function supportsWebPEncoding(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Compress an image file to WebP format using Canvas API.
 *
 * - If the file is not a compressible image (SVG, GIF, non-image), returns original.
 * - If the browser doesn't support WebP encoding, returns original.
 * - If the WebP output is larger than the original, returns original.
 *
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns A new File in WebP format, or the original if compression isn't beneficial
 */
export async function compressToWebP(
  file: File,
  options?: CompressOptions,
): Promise<File> {
  // Skip non-compressible files
  if (!isCompressibleImage(file)) return file;

  // Skip if browser doesn't support WebP encoding
  if (!supportsWebPEncoding()) return file;

  const quality = options?.quality ?? 0.85;
  const maxWidth = options?.maxWidth ?? 4096;
  const maxHeight = options?.maxHeight ?? 4096;

  try {
    // Decode the image
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    // Scale down if exceeding max dimensions
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Draw on canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // Encode to WebP
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    );

    if (!blob) return file;

    // If WebP is larger than original, return original
    if (blob.size >= file.size) return file;

    // Create a new File with .webp extension
    const baseName = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch {
    // On any error, return original file unchanged
    return file;
  }
}
