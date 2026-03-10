import { NextResponse } from 'next/server';
import { getGlobalActiveTheme } from '@/lib/server-trpc';
import { getDefaultBrandAssets } from '@/components/features/theme-editor-3.0/theme-editor/editor/brand/default-logos';
import { getCurrentModeVariants } from '@/components/features/theme-editor-3.0/theme-editor/editor/brand/utils';

const CACHE_HEADERS = {
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
};

export async function GET() {
    try {
        const theme = await getGlobalActiveTheme();
        const themeData = theme?.themeData as Record<string, any> | undefined;
        const horizontalLogo = themeData?.brand?.logos?.horizontal;

        if (horizontalLogo) {
            // Emails & open graph prefer the light-mode base originally generated for "Logos (V2) - Horizontal"
            // or we can rely directly on standard SVG as fallback. 
            // It is safer to use the parsed/generated mode from "getCurrentModeVariants"
            const lightSvg = getCurrentModeVariants(horizontalLogo, false).original;
            if (lightSvg) {
                return new NextResponse(lightSvg, { headers: CACHE_HEADERS });
            }
        }
    } catch {
        // Fall through to default
    }

    const defaultAssets = getDefaultBrandAssets();
    const defaultHorizontalSvg = getCurrentModeVariants(defaultAssets.horizontal, false).original;

    return new NextResponse(defaultHorizontalSvg || defaultAssets.horizontal.svgContent, {
        headers: CACHE_HEADERS
    });
}
