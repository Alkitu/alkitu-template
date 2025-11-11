// Popular Google Fonts organized by category
export const GOOGLE_FONTS = {
  sans: [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Nunito',
    'PT Sans',
    'Ubuntu',
    'Raleway',
    'Mukti',
    'Rubik',
    'Work Sans',
    'Fira Sans',
    'DM Sans',
    'Plus Jakarta Sans',
    'Manrope',
    'Outfit',
    'Sora'
  ],
  serif: [
    'Playfair Display',
    'Merriweather',
    'Lora',
    'Source Serif Pro',
    'Crimson Text',
    'Libre Baskerville',
    'PT Serif',
    'Cormorant Garamond',
    'EB Garamond',
    'Vollkorn',
    'Bitter',
    'Rokkitt',
    'Arvo',
    'Cardo',
    'Neuton'
  ],
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Source Code Pro',
    'Roboto Mono',
    'Inconsolata',
    'Ubuntu Mono',
    'Fira Mono',
    'Space Mono',
    'IBM Plex Mono',
    'Cascadia Code'
  ],
  display: [
    'Oswald',
    'Anton',
    'Bebas Neue',
    'Righteous',
    'Fredoka One',
    'Bangers',
    'Permanent Marker',
    'Caveat',
    'Dancing Script',
    'Great Vibes'
  ]
};

// Flatten all fonts for the main selector, with Poppins first
const allFonts = [
  ...GOOGLE_FONTS.sans,
  ...GOOGLE_FONTS.serif,
  ...GOOGLE_FONTS.mono,
  ...GOOGLE_FONTS.display
].sort();

// Put Poppins at the beginning as the default
export const ALL_GOOGLE_FONTS = [
  'Poppins',
  ...allFonts.filter(font => font !== 'Poppins')
];