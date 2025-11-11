import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Icons } from '@/lib/icons';
import { Switch } from './switch';
import { useState } from 'react';

// Local type definition instead of importing from Prisma
type OgType =
  | 'website'
  | 'article'
  | 'profile'
  | 'book'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_station'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other';

/**
 * Open Graph and Twitter Card Metadata Reference
 * --------------------------------------------
 * Required Open Graph Properties:
 * - og:type        Type of content (e.g. "article")
 * - og:title       Title of the content
 * - og:description Brief description (usually Meta Description)
 * - og:url         Canonical URL of the content
 * - og:site_name   Name of the website
 * - og:image       URL for the social media image
 * - og:image:secure_url Same as og:image (fallback for HTTP/HTTPS)
 *
 * Required Twitter Card Properties:
 * - twitter:card    Card type (usually "summary_large_image")
 * - twitter:site    Site's X/Twitter handle (e.g. "@example")
 * - twitter:creator Content author's handle (e.g. "@author")
 *
 * Example Implementation:
 * <meta property="og:type" content="article" />
 * <meta property="og:title" content="Title of article" />
 * <meta property="og:description" content="Brief description of article..." />
 * <meta property="og:url" content="https://example.com/article-slug/" />
 * <meta property="og:site_name" content="Site Name" />
 * <meta property="article:section" content="Category name" />
 * <meta property="og:image" content="https://example.com/img/social.jpg" />
 * <meta property="og:image:secure_url" content="https://example.com/img/social.jpg" />
 * <meta name="twitter:card" content="summary_large_image" />
 * <meta name="twitter:site" content="@example" />
 * <meta name="twitter:creator" content="@author" />
 */

// Función para calcular el ancho aproximado en píxeles
function calculatePixelWidth(text: string): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;
  context.font = '16px Arial'; // Fuente estándar de Google
  return context.measureText(text).width;
}

// Función para convertir el código de idioma a locale
function getLocaleFromLang(lang: string): string {
  const localeMap: { [key: string]: string } = {
    es: 'es_ES',
    en: 'en_US',
    // Añadir más idiomas según sea necesario
  };
  return localeMap[lang] || process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es_ES';
}

interface SeoProgressProps {
  // Basic props
  title: string;
  slug: string;
  description?: string;
  tags: string[];
  domain?: string;
  lang: string; // Añadido para manejar el locale

  // Meta tags
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: string;

  // Open Graph properties
  ogType?: OgType;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogImage?: string;
  ogImageSecureUrl?: string;
  ogLocale?: string;
  articleSection?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;

  // Twitter Card properties
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterImageAlt?: string;
}

export function SeoProgress({
  title,
  slug,
  description,
  domain = typeof window !== 'undefined'
    ? new URL(window.location.href).hostname
    : 'localhost',
  lang,
  metaTitle,
  metaDescription,
  metaImage,
  // Open Graph props
  ogType = 'website' as OgType,
  ogTitle,
  ogDescription,
  ogUrl,
  ogSiteName = process.env.NEXT_PUBLIC_SITE_NAME,
  ogImage,
  ogImageSecureUrl,
  ogLocale = getLocaleFromLang(lang),
  articleSection,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  // Twitter Card props
  twitterCard = 'summary_large_image',
  twitterSite,
  twitterCreator,
  twitterTitle,
  twitterDescription,
  twitterImage,
  twitterImageAlt,
}: SeoProgressProps) {
  const [reuseOpenGraph, setReuseOpenGraph] = useState(true);

  // Compute final values based on toggle state
  const finalTwitterTitle = reuseOpenGraph
    ? ogTitle || twitterTitle
    : twitterTitle;
  const finalTwitterDescription = reuseOpenGraph
    ? ogDescription || twitterDescription
    : twitterDescription;
  const finalTwitterImage = reuseOpenGraph
    ? ogImage || twitterImage
    : twitterImage;

  const metrics = {
    title: {
      chars: metaTitle?.length || 0,
      pixels: calculatePixelWidth(metaTitle || ''),
      target: {
        min: 50,
        max: 60,
        minPx: 369,
        maxPx: 580,
      },
    },
    description: {
      chars: metaDescription?.length || 0,
      pixels: calculatePixelWidth(metaDescription || ''),
      target: {
        min: 120,
        max: 160,
        minPx: 802,
        maxPx: 920,
      },
    },
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between px-2">
        <label className="text-sm text-muted-foreground flex items-center gap-2">
          <Switch
            checked={reuseOpenGraph}
            onCheckedChange={setReuseOpenGraph}
          />
          Usar datos de Open Graph en otras redes sociales
        </label>
      </div>

      <Tabs defaultValue="google">
        <TabsList>
          <TabsTrigger value="google" className="flex items-center gap-2">
            <Icons.Google className="h-4 w-4  m-auto" />
            <p className="m-auto h-4">Google</p>
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Icons.Facebook className="h-4 w-4  m-auto" />
            <p className="m-auto h-4">Facebook</p>
          </TabsTrigger>
          <TabsTrigger value="x" className="flex items-center gap-2">
            <Icons.Twitter className="h-4 w-4  m-auto" />
            <p className="m-auto h-4">X (Twitter)</p>
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Icons.Linkedin className="h-4 w-4  m-auto " />
            <p className="m-auto h-4">LinkedIn</p>
          </TabsTrigger>
          <TabsTrigger
            value="whatsapp"
            className="flex items-center justify-center align-middle  gap-2"
          >
            <Icons.WhatsApp className="h-4 w-4" />
            <p className="m-auto h-4">WhatsApp</p>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="google">
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-2">Vista previa en Google</h4>
            <div className="flex items-center gap-2">
              <Image
                src="/favicon.ico"
                alt="Favicon"
                width={16}
                height={16}
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23bdc1c6' width='18' height='18'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E";
                }}
              />
              <div className="flex items-center gap-1 text-[#202124]">
                <cite className="text-[14px] leading-[20px] text-[#202124] font-normal not-italic hover:text-[#1a0dab]">
                  {domain}
                </cite>
                <span className="text-[14px] leading-[20px] text-[#5f6368]">
                  ›
                </span>
                <cite className="text-[14px] leading-[20px] text-[#5f6368] font-normal not-italic truncate max-w-[450px]">
                  {slug || 'url-de-la-pagina'}
                </cite>
              </div>
            </div>
            <h3 className="text-[#1a0dab] hover:underline cursor-pointer inline-block font-[arial] leading-[1.3] mb-1 text-[20px] w-[600px] max-w-full">
              {metaTitle || title || 'Título de la página'}
            </h3>
            <span className="block font-[arial] text-[14px] font-normal leading-[1.58] text-[#4d5156] w-[600px] max-w-full line-clamp-2">
              {metaDescription ||
                description ||
                'Descripción de la página que aparecerá en los resultados de búsqueda de Google. Asegúrate de que sea descriptiva y atractiva.'}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="facebook">
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-2">
              Vista previa en Facebook
            </h4>
            <div className="border rounded-lg overflow-hidden max-w-[500px]">
              {ogImage ? (
                <div className="aspect-[1.91/1] relative bg-gray-100">
                  <Image
                    src={ogImage}
                    alt={ogTitle || title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[1.91/1] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">1200 x 630 px</span>
                </div>
              )}
              <div className="p-3 bg-white border-t">
                <div className="text-[12px] uppercase text-[#606770] mb-1">
                  {domain}
                </div>
                <h3 className="text-[16px] font-semibold text-[#1c1e21] leading-[20px] mb-1">
                  {ogTitle || metaTitle || title || 'Título de la página'}
                </h3>
                <p className="text-[14px] text-[#606770] leading-[20px] line-clamp-2">
                  {ogDescription ||
                    metaDescription ||
                    description ||
                    'Descripción de la página'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="x">
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-2">Vista previa en X</h4>
            <div className="border rounded-2xl overflow-hidden max-w-[500px] bg-white">
              {finalTwitterImage ? (
                <div className="aspect-[1.91/1] relative bg-gray-100">
                  <Image
                    src={finalTwitterImage}
                    alt={finalTwitterTitle || title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[1.91/1] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">1200 x 630 px</span>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-[15px] font-bold text-[#0f1419] leading-5 mb-1">
                  {finalTwitterTitle ||
                    metaTitle ||
                    title ||
                    'Título de la página'}
                </h3>
                <p className="text-[15px] text-[#536471] leading-5 line-clamp-2">
                  {finalTwitterDescription ||
                    metaDescription ||
                    description ||
                    'Descripción de la página'}
                </p>
                <div className="text-[15px] text-[#536471] mt-1 flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <g>
                      <path d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"></path>
                      <path d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"></path>
                    </g>
                  </svg>
                  {domain}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="linkedin">
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-2">
              Vista previa en LinkedIn
            </h4>
            <div className="border border-[#e7e7e7] rounded-[2px] overflow-hidden max-w-[552px] bg-white">
              {ogImage ? (
                <div className="aspect-[1.91/1] relative bg-gray-100">
                  <Image
                    src={ogImage}
                    alt={ogTitle || title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[1.91/1] bg-[#f3f6f8] flex items-center justify-center border-b border-[#e7e7e7]">
                  <span className="text-[#666666]">1200 x 630 px</span>
                </div>
              )}
              <div className="p-2">
                <h3 className="text-[14px] font-medium text-[rgba(0,0,0,0.9)] leading-[20px] line-clamp-2 mb-1">
                  {ogTitle || metaTitle || title || 'Título de la página'}
                </h3>
                <div className="text-[12px] text-[rgba(0,0,0,0.6)] truncate mb-1">
                  {domain}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp">
          <div className="space-y-2">
            <h4 className="text-sm font-medium mb-2">
              Vista previa en WhatsApp
            </h4>
            <div className="border rounded-lg overflow-hidden max-w-[400px] bg-[#E8E8E8]">
              <div className="p-3 space-y-1">
                <div className="text-[14px] text-[#666666] truncate">
                  {domain}
                </div>
                <h3 className="text-[15px] font-medium text-black leading-5 line-clamp-2">
                  {ogTitle || metaTitle || title || 'Título de la página'}
                </h3>
                <p className="text-[14px] text-[#666666] leading-[18px] line-clamp-2">
                  {ogDescription ||
                    metaDescription ||
                    description ||
                    'Descripción de la página'}
                </p>
              </div>
              {ogImage ? (
                <div className="aspect-[1.91/1] relative bg-gray-100">
                  <Image
                    src={ogImage}
                    alt={ogTitle || title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[1.91/1] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">1200 x 630 px</span>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
