/**
 * Canonical design tokens for the "Premium Roast Collective" theme (Stitch AI).
 * Mirrored (by value, kept in sync manually) in the Tailwind `@theme` block in
 * src/app/globals.css — Tailwind v4's CSS-first config can't import a .ts file.
 */

export const darkPalette = {
  surface0: '#121212', // base background
  surface1: '#1E1E1E', // cards / inputs
  surface2: '#2C2C2C', // modals / popovers
  primary: '#f2be8c',
  onPrimary: '#482904',
  primaryContainer: '#d4a373',
  onPrimaryContainer: '#5b3912',
  secondary: '#c9c8ae',
  onSecondary: '#31311f',
  secondaryContainer: '#484834',
  onSecondaryContainer: '#b7b69d',
  onSurface: '#eae1db',
  onSurfaceVariant: '#d4c4b7',
  outline: '#9c8e82',
  outlineVariant: '#50453b',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  coffeeBean: '#3D2B1F',
  oliveDrab: '#6B705C',
  latteWhite: '#F4F1DE',
} as const;

// No light-mode reference screen exists in the Stitch design (it's dark-only).
// This is a best-effort derivation reusing the design system's own Material 3
// "inverse" tokens, which are specifically meant for the opposite surface polarity.
export const lightPalette = {
  background: '#eae1db', // inverse-surface
  paper: '#f7f3ee',
  primary: '#7d562d', // inverse-primary
  onPrimary: '#ffffff',
  secondary: '#6B705C', // oliveDrab reused, reads fine on light
  onSecondary: '#ffffff',
  textPrimary: '#342f2c', // inverse-on-surface
  textSecondary: '#6b5b4f',
  divider: '#e0d6cc',
} as const;

// References the CSS custom properties next/font/google sets on <body> in
// src/app/layout.tsx — keeps the actual self-hosted font in sync with MUI/Tailwind.
export const typography = {
  fontDisplay: 'var(--font-manrope), sans-serif',
  fontBody: 'var(--font-work-sans), sans-serif',
  fontMono: 'var(--font-jetbrains-mono), monospace',
} as const;

export const radius = {
  sm: 2, // 0.125rem
  DEFAULT: 4, // 0.25rem
  md: 6, // 0.375rem
  lg: 8, // 0.5rem
  xl: 12, // 0.75rem
  full: 9999,
} as const;

export const spacing = {
  base: 4,
  gutterDesktop: 24,
  marginDesktop: 64,
  gutterMobile: 16,
  marginMobile: 20,
} as const;
