import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-bg-tertiary) / <alpha-value>)",
          deep: "rgb(var(--color-bg-deep) / <alpha-value>)",
          elevated: "rgb(var(--color-bg-elevated) / <alpha-value>)",
          "elevated-hover": "rgb(var(--color-bg-elevated-hover) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          raised: "rgb(var(--color-surface-raised) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--color-border) / <alpha-value>)",
          hover: "rgb(var(--color-border-hover) / <alpha-value>)",
          hairline: "var(--border-hairline)",
          "hairline-strong": "var(--border-hairline-strong)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
          disabled: "rgb(var(--color-text-disabled) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent-primary) / <alpha-value>)",
          hover: "rgb(var(--color-accent-primary-hover) / <alpha-value>)",
          glow: "rgb(var(--color-accent-glow) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
          green: "rgb(var(--color-success-green) / <alpha-value>)",
        },
        price: {
          strike: "rgb(var(--color-price-strike) / <alpha-value>)",
          active: "rgb(var(--color-price-active) / <alpha-value>)",
        },
        badge: {
          founding: "rgb(var(--color-badge-founding) / <alpha-value>)",
        },
        /** Industry Explorer visual-theme accents (Phase 11) — only the
         * 2 of 5 `visualTheme` values with no existing token to reuse.
         * warm/clean/professional map to badge.founding/accent.glow/
         * accent.DEFAULT directly in component code instead of being
         * duplicated here. */
        theme: {
          elegant: "rgb(var(--color-theme-elegant) / <alpha-value>)",
          vibrant: "rgb(var(--color-theme-vibrant) / <alpha-value>)",
        },
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        whatsapp: "rgb(var(--color-whatsapp) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        "3xl": "var(--font-size-3xl)",
        "4xl": "var(--font-size-4xl)",
        "5xl": "var(--font-size-5xl)",
        "6xl": "var(--font-size-6xl)",
        "7xl": "var(--font-size-7xl)",
        "8xl": "var(--font-size-8xl)",
      },
      spacing: {
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "24": "var(--space-24)",
        "32": "var(--space-32)",
        "48": "var(--space-48)",
        header: "var(--header-height)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
        card: "var(--radius-card)",
        button: "var(--radius-button)",
        sharp: "var(--radius-sharp)",
      },
      boxShadow: {
        "glass-sm": "var(--shadow-glass-sm)",
        "glass-md": "var(--shadow-glass-md)",
        "glass-lg": "var(--shadow-glass-lg)",
        "glow-accent": "var(--shadow-glow-accent)",
        "card-rest": "var(--shadow-card-rest)",
        "card-hover": "var(--shadow-card-hover)",
      },
      transitionTimingFunction: {
        entrance: "var(--ease-entrance)",
        exit: "var(--ease-exit)",
        micro: "var(--ease-micro)",
        emphasis: "var(--ease-emphasis)",
        "out-expo": "var(--ease-out-expo)",
        "out-quart": "var(--ease-out-quart)",
        "in-out-quart": "var(--ease-in-out-quart)",
        spring: "var(--ease-spring)",
      },
      transitionDuration: {
        micro: "var(--duration-micro)",
        small: "var(--duration-small)",
        medium: "var(--duration-medium)",
        large: "var(--duration-large)",
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
        reveal: "var(--duration-reveal)",
      },
      keyframes: {
        shimmer: {
          // translateX-based shimmer — compositor-only (GPU), zero paint cost.
          // Replaces the backgroundPosition approach which triggered repaint
          // every frame and could not be GPU-composited (BUG-024 fix).
          // The animated element is a child overlay div (see PriceCallout.tsx)
          // that travels from fully-left to fully-right of its clipped parent.
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        caretBlink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        /* Ambient "scanner" line drifting down through the blueprint grid.
           translateY with vh units — still a pure transform (compositor-only,
           no layout/paint cost) even though the unit is viewport-relative. */
        scanDrift: {
          "0%": { transform: "translateY(-10vh)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(70vh)", opacity: "0" },
        },
      },
      animation: {
        shimmer: "shimmer var(--duration-shimmer) linear infinite",
        "caret-blink": "caretBlink var(--duration-caret-blink) steps(1) infinite",
        marquee: "marquee var(--duration-marquee) linear infinite",
        "scan-drift": "scanDrift 15s linear infinite",
      },
      zIndex: {
        "cursor-spotlight": "var(--z-cursor-spotlight)",
        header: "var(--z-header)",
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        "loading-screen": "var(--z-loading-screen)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
