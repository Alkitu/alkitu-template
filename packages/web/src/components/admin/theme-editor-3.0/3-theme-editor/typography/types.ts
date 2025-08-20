// Typography element type definition
export interface TypographyElement {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  wordSpacing: string;
  textDecoration: string;
}

// Typography elements configuration
export interface TypographyElements {
  h1: TypographyElement;
  h2: TypographyElement;
  h3: TypographyElement;
  h4: TypographyElement;
  h5: TypographyElement;
  paragraph: TypographyElement;
  quote: TypographyElement;
  emphasis: TypographyElement;
}

// Default typography values using global CSS variables
export const DEFAULT_TYPOGRAPHY: TypographyElements = {
  h1: {
    fontFamily: 'var(--font-sans)',
    fontSize: '2.5rem',
    fontWeight: '700',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    wordSpacing: '0px',
    textDecoration: 'none'
  },
  h2: {
    fontFamily: 'var(--font-sans)',
    fontSize: '2rem',
    fontWeight: '600',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    wordSpacing: '0px',
    textDecoration: 'none'
  },
  h3: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.5rem',
    fontWeight: '600',
    lineHeight: '1.4',
    letterSpacing: '0em',
    wordSpacing: '0px',
    textDecoration: 'none'
  },
  h4: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.25rem',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '0em',
    wordSpacing: '0px',
    textDecoration: 'none'
  },
  h5: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.125rem',
    fontWeight: '500',
    lineHeight: '1.5',
    letterSpacing: '0em',
    wordSpacing: '0px',
    textDecoration: 'none'
  },
  paragraph: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.6',
    letterSpacing: '0em',
    wordSpacing: '0px',
    textDecoration: 'none'
  },
  quote: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.125rem',
    fontWeight: '400',
    lineHeight: '1.7',
    letterSpacing: '0.01em',
    wordSpacing: '0px',
    textDecoration: 'none'
  },
  emphasis: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: '1.5',
    letterSpacing: '0.02em',
    wordSpacing: '0px',
    textDecoration: 'none'
  }
};