import { NextResponse } from 'next/server';
import { getGlobalActiveTheme } from '@/lib/server-trpc';
import { getDefaultBrandAssets } from '@/components/features/theme-editor-3.0/theme-editor/editor/brand/default-logos';

const CACHE_HEADERS = {
  'Content-Type': 'image/svg+xml',
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

export async function GET() {
  try {
    const theme = await getGlobalActiveTheme();
    const themeData = theme?.themeData as Record<string, any> | undefined;
    const iconSvg: string | undefined = themeData?.brand?.logos?.icon?.svgContent;

    if (iconSvg) {
      return new NextResponse(iconSvg, { headers: CACHE_HEADERS });
    }
  } catch {
    // Fall through to default
  }

  const defaultSvg = getDefaultBrandAssets().icon.svgContent;
  return new NextResponse(defaultSvg, { headers: CACHE_HEADERS });
}
