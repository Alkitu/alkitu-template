export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'overline' | 'line-through';
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
}

export interface ThemeTypography {
  base: TypographyStyle;      // Párrafos y texto general
  accent: TypographyStyle;     // Énfasis y destacados
  quote: TypographyStyle;      // Citas y blockquotes
  h1: TypographyStyle;
  h2: TypographyStyle;
  h3: TypographyStyle;
  h4: TypographyStyle;
  h5: TypographyStyle;
}

export interface GoogleFont {
  family: string;
  variants: string[];
  category: string;
  subsets: string[];
}

export const DEFAULT_TYPOGRAPHY: ThemeTypography = {
  base: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
  },
  accent: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.5,
    letterSpacing: 0.02,
    wordSpacing: 0,
  },
  quote: {
    fontFamily: 'Georgia',
    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'italic',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.6,
    letterSpacing: 0.01,
    wordSpacing: 0,
  },
  h1: {
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: '700',
    fontStyle: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.2,
    letterSpacing: -0.02,
    wordSpacing: 0,
  },
  h2: {
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '600',
    fontStyle: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.3,
    letterSpacing: -0.01,
    wordSpacing: 0,
  },
  h3: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '600',
    fontStyle: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.4,
    letterSpacing: 0,
    wordSpacing: 0,
  },
  h4: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '500',
    fontStyle: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.4,
    letterSpacing: 0,
    wordSpacing: 0,
  },
  h5: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'normal',
    textTransform: 'none',
    textDecoration: 'none',
    lineHeight: 1.5,
    letterSpacing: 0,
    wordSpacing: 0,
  },
};

export const FONT_WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
];

export const TEXT_TRANSFORMS = [
  { value: 'none', label: 'Por defecto' },
  { value: 'uppercase', label: 'MAYÚSCULAS' },
  { value: 'lowercase', label: 'minúsculas' },
  { value: 'capitalize', label: 'Capitalizar' },
];

export const TEXT_DECORATIONS = [
  { value: 'none', label: 'Por defecto' },
  { value: 'underline', label: 'Subrayado' },
  { value: 'overline', label: 'Sobrerayado' },
  { value: 'line-through', label: 'Tachado' },
];

export const FONT_STYLES = [
  { value: 'normal', label: 'Por defecto' },
  { value: 'italic', label: 'Itálica' },
];