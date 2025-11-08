import type { Config } from "tailwindcss";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // CSS variable-based color system
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        info: {
          DEFAULT: "var(--info)",
          foreground: "var(--info-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Legacy support for existing components
        inside: {
          DEFAULT: "#CEFF66",
          foreground: "var(--primary-foreground)",
        },
        "design-primary": "#F2AB27",
        "design-secondary": "#F2921D",
        "primary-dark": "#4A4A4A",
        error: "#dc2626",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "collapsible-down": {
          from: { height: "0", opacity: "0" },
          to: {
            height: "var(--radix-collapsible-content-height)",
            opacity: "1",
          },
        },
        "collapsible-up": {
          from: {
            height: "var(--radix-collapsible-content-height)",
            opacity: "1",
          },
          to: { height: "0", opacity: "0" },
        },
        "theme-transition": {
          "0%": { opacity: "0.8" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        "theme-transition": "theme-transition 200ms ease-in-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    // Custom plugin for theme-aware utilities
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.theme-transition': {
          transition: 'background-color 200ms, color 200ms, border-color 200ms',
        },
        '.bg-primary\\/10': {
          backgroundColor: 'color-mix(in oklch, var(--primary) 10%, transparent)',
        },
        '.bg-primary\\/20': {
          backgroundColor: 'color-mix(in oklch, var(--primary) 20%, transparent)',
        },
        '.bg-primary\\/50': {
          backgroundColor: 'color-mix(in oklch, var(--primary) 50%, transparent)',
        },
        '.bg-primary\\/90': {
          backgroundColor: 'color-mix(in oklch, var(--primary) 90%, transparent)',
        },
        '.bg-success\\/10': {
          backgroundColor: 'color-mix(in oklch, var(--success) 10%, transparent)',
        },
        '.bg-success\\/20': {
          backgroundColor: 'color-mix(in oklch, var(--success) 20%, transparent)',
        },
        '.bg-warning\\/10': {
          backgroundColor: 'color-mix(in oklch, var(--warning) 10%, transparent)',
        },
        '.bg-warning\\/20': {
          backgroundColor: 'color-mix(in oklch, var(--warning) 20%, transparent)',
        },
        '.bg-info\\/10': {
          backgroundColor: 'color-mix(in oklch, var(--info) 10%, transparent)',
        },
        '.bg-info\\/20': {
          backgroundColor: 'color-mix(in oklch, var(--info) 20%, transparent)',
        },
        '.bg-destructive\\/10': {
          backgroundColor: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
        },
        '.bg-destructive\\/20': {
          backgroundColor: 'color-mix(in oklch, var(--destructive) 20%, transparent)',
        },
        '.from-primary\\/10': {
          '--tw-gradient-from': 'color-mix(in oklch, var(--primary) 10%, transparent)',
        },
        '.from-primary\\/5': {
          '--tw-gradient-from': 'color-mix(in oklch, var(--primary) 5%, transparent)',
        },
        '.to-primary\\/5': {
          '--tw-gradient-to': 'color-mix(in oklch, var(--primary) 5%, transparent)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;

export default config;