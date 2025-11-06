import { LogoVariant } from './types';
import { detectColorsFromSVG, createDefaultModeConfig, extractSVGMetadata } from './utils';

// SVG content for the default Alkitu logos
const ALKITU_ICON_SVG = `<svg width="54" height="51" viewBox="0 0 54 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.9481 31.4206H33.5498L26.4672 9.8328L13.1597 50.5391H0L19.222 0H33.8603L49.4006 41.0021H19.8283L22.9481 31.4206Z" fill="black"/>
<path d="M50.6723 44.3584L53.0233 50.539H39.8784L37.8379 44.3584H50.6723Z" fill="#2AB34B"/>
</svg>`;

const ALKITU_HORIZONTAL_SVG = `<svg width="204" height="57" viewBox="0 0 204 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M69.9692 6.31396V56.8087H57.0312V6.31396H69.9692Z" fill="black"/>
<path d="M127.932 16.1914V56.809H115.098V16.1914H127.932Z" fill="black"/>
<path d="M158.228 47.0942V56.8087H152.181C147.439 56.7496 143.758 55.5371 141.136 53.1713C138.504 50.7908 137.232 48.1884 137.276 42.821L137.439 26.0387H131.924V16.1911H137.528L137.631 6.31396H150.066L149.978 16.1763H158.228V25.8761H149.889L149.712 42.6584C149.577 43.8578 149.917 45.0622 150.658 46.0148C151.595 46.7435 152.772 47.0919 153.955 46.9907L158.228 47.0942Z" fill="black"/>
<path d="M203.415 16.2206L203.015 56.853H190.595V49.2086C189.42 51.5508 187.592 53.5024 185.331 54.8273C182.891 56.2374 180.105 56.9389 177.288 56.853C175.211 56.9235 173.145 56.533 171.238 55.7098C169.331 54.8866 167.63 53.651 166.257 52.0919C163.536 48.9572 162.22 44.6988 162.265 39.2427V16.1911H174.877L174.656 37.8084C174.49 40.1507 175.237 42.4661 176.74 44.27C178.332 45.7954 180.451 46.6471 182.655 46.6471C184.859 46.6471 186.978 45.7954 188.569 44.27C190.148 42.3608 190.95 39.9273 190.817 37.4536L191.024 16.1763L203.415 16.2206Z" fill="black"/>
<path d="M121.515 12.8344C125.059 12.8344 127.932 9.96132 127.932 6.4172C127.932 2.87308 125.059 0 121.515 0C117.971 0 115.098 2.87308 115.098 6.4172C115.098 9.96132 117.971 12.8344 121.515 12.8344Z" fill="black"/>
<path d="M97.0424 56.8235L85.6127 40.6474V56.8235H73.9316V6.31396H85.6127V34.0232L97.1903 16.1911H111.075L95.4012 37.7789L111.104 56.8235H97.0424Z" fill="#2AB34B"/>
<path d="M22.9481 37.7346H33.5498L26.4672 16.1468L13.1597 56.8531H0L19.222 6.31396H33.8603L49.4006 47.316H19.8283L22.9481 37.7346Z" fill="black"/>
<path d="M50.6723 50.6724L53.0233 56.853H39.8784L37.8379 50.6724H50.6723Z" fill="#2AB34B"/>
</svg>`;

const ALKITU_VERTICAL_SVG = `<svg width="57" height="204" viewBox="0 0 57 204" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.3125 133.445L56.8073 133.445L56.8073 146.383L6.3125 146.383L6.3125 133.445Z" fill="black"/>
<path d="M16.1914 75.4825L56.809 75.4825L56.809 88.3169L16.1914 88.3169L16.1914 75.4825Z" fill="black"/>
<path d="M47.0928 45.1861L56.8073 45.1861L56.8073 51.2337C56.7481 55.9751 55.5357 59.6569 53.1699 62.2789C50.7893 64.9109 48.1869 66.1825 42.8196 66.1381L26.0373 65.9755L26.0373 71.4907L16.1897 71.4907L16.1897 65.8868L6.3125 65.7833L6.3125 53.3481L16.1749 53.4368L16.1749 45.1861L25.8746 45.1861L25.8746 53.5255L42.6569 53.703C43.8563 53.8372 45.0607 53.4977 46.0134 52.7566C46.742 51.8195 47.0905 50.6421 46.9893 49.4593L47.0928 45.1861Z" fill="black"/>
<path d="M16.2201 -0.000126029L56.8525 0.399105L56.8525 12.8195L49.2081 12.8195C51.5503 13.9943 53.5019 15.8227 54.8268 18.0834C56.2369 20.524 56.9384 23.3096 56.8525 26.127C56.923 28.2032 56.5325 30.2691 55.7093 32.1764C54.8861 34.0836 53.6505 35.7848 52.0914 37.1575C48.9567 39.8782 44.6983 41.1942 39.2422 41.1498L16.1906 41.1498L16.1906 28.5372L37.8079 28.759C40.1502 28.9243 42.4656 28.1772 44.2695 26.6741C45.7949 25.0829 46.6466 22.9639 46.6466 20.7596C46.6466 18.5554 45.7949 16.4363 44.2695 14.8452C42.3603 13.2665 39.9269 12.4641 37.4531 12.5977L16.1758 12.3907L16.2201 -0.000126029Z" fill="black"/>
<path d="M12.8344 81.8997C12.8344 78.3556 9.96132 75.4825 6.4172 75.4825C2.87308 75.4825 -4.35423e-07 78.3556 -2.80504e-07 81.8997C-1.25586e-07 85.4438 2.87308 88.3169 6.4172 88.3169C9.96132 88.3169 12.8344 85.4438 12.8344 81.8997Z" fill="black"/>
<path d="M56.8221 106.372L40.646 117.802L56.8221 117.802L56.8221 129.483L6.3125 129.483L6.3125 117.802L34.0218 117.802L16.1897 106.224L16.1897 92.34L37.7775 108.013L56.8221 92.3105L56.8221 106.372Z" fill="#2AB34B"/>
<path d="M37.7331 180.466L37.7331 169.865L16.1453 176.947L56.8516 190.255L56.8516 203.415L6.3125 184.193L6.3125 169.554L47.3146 154.014L47.3146 183.586L37.7331 180.466Z" fill="black"/>
<path d="M50.6719 152.742L56.8525 150.391L56.8525 163.536L50.6719 165.577L50.6719 152.742Z" fill="#2AB34B"/>
</svg>`;

// Function to create default Alkitu icon logo with proper light/dark mode support
export function createDefaultAlkituIconLogo(primaryColor: string = '#2AB34B'): LogoVariant {
  const svgContent = ALKITU_ICON_SVG;
  const detectedColors = detectColorsFromSVG(svgContent);
  
  // Create light and dark mode configurations with proper theme-aware colors
  const lightModeConfig = createDefaultModeConfig(svgContent, detectedColors, primaryColor, false);
  const darkModeConfig = createDefaultModeConfig(svgContent, detectedColors, primaryColor, true);
  
  // Extract metadata
  const metadata = {
    fileName: 'alkitu-icon.svg',
    fileSize: '0.9 KB',
    dimensions: '54 × 51',
    viewBox: '0 0 54 51',
    colorCount: detectedColors.length,
    hasGradients: false
  };
  
  const logoVariant: LogoVariant = {
    id: `alkitu_icon_${Date.now()}`,
    name: 'alkitu-icon.svg',
    type: 'icon',
    aspectRatio: '1:1',
    svgContent,
    detectedColors,
    lightMode: lightModeConfig,
    darkMode: darkModeConfig,
    metadata
  };
  
  return logoVariant;
}

// Function to create default Alkitu horizontal logo with proper light/dark mode support
export function createDefaultAlkituHorizontalLogo(primaryColor: string = '#2AB34B'): LogoVariant {
  const svgContent = ALKITU_HORIZONTAL_SVG;
  const detectedColors = detectColorsFromSVG(svgContent);
  
  // Create light and dark mode configurations with proper theme-aware colors
  const lightModeConfig = createDefaultModeConfig(svgContent, detectedColors, primaryColor, false);
  const darkModeConfig = createDefaultModeConfig(svgContent, detectedColors, primaryColor, true);
  
  // Extract metadata
  const metadata = {
    fileName: 'alkitu-horizontal.svg',
    fileSize: '2.1 KB',
    dimensions: '204 × 57',
    viewBox: '0 0 204 57',
    colorCount: detectedColors.length,
    hasGradients: false
  };
  
  const logoVariant: LogoVariant = {
    id: `alkitu_horizontal_${Date.now()}`,
    name: 'alkitu-horizontal.svg',
    type: 'horizontal',
    aspectRatio: '3:1',
    svgContent,
    detectedColors,
    lightMode: lightModeConfig,
    darkMode: darkModeConfig,
    metadata
  };
  
  return logoVariant;
}

// Function to create default Alkitu vertical logo with proper light/dark mode support
export function createDefaultAlkituVerticalLogo(primaryColor: string = '#2AB34B'): LogoVariant {
  const svgContent = ALKITU_VERTICAL_SVG;
  const detectedColors = detectColorsFromSVG(svgContent);
  
  // Create light and dark mode configurations with proper theme-aware colors
  const lightModeConfig = createDefaultModeConfig(svgContent, detectedColors, primaryColor, false);
  const darkModeConfig = createDefaultModeConfig(svgContent, detectedColors, primaryColor, true);
  
  // Extract metadata
  const metadata = {
    fileName: 'alkitu-vertical.svg',
    fileSize: '2.3 KB',
    dimensions: '57 × 204',
    viewBox: '0 0 57 204',
    colorCount: detectedColors.length,
    hasGradients: false
  };
  
  const logoVariant: LogoVariant = {
    id: `alkitu_vertical_${Date.now()}`,
    name: 'alkitu-vertical.svg',
    type: 'vertical',
    aspectRatio: '1:3',
    svgContent,
    detectedColors,
    lightMode: lightModeConfig,
    darkMode: darkModeConfig,
    metadata
  };
  
  return logoVariant;
}

// Function to get default brand assets with Alkitu logos
export function getDefaultBrandAssets(primaryColor: string = '#2AB34B') {
  return {
    icon: createDefaultAlkituIconLogo(primaryColor),
    horizontal: createDefaultAlkituHorizontalLogo(primaryColor),
    vertical: createDefaultAlkituVerticalLogo(primaryColor)
  };
}