/**
 * Canonical design tokens. "Black and tan": one warm-neutral gray family plus a
 * single tan accent, used identically in both modes (deeper tan in light mode
 * so it keeps AA contrast on the pale surface).
 * Mirrored (by value, kept in sync manually) in the Tailwind `@theme` block in
 * src/app/globals.css, since Tailwind v4's CSS-first config can't import a .ts file.
 */

export const darkPalette = {
  background: '#131110',
  paper: '#1c1a18',
  raised: '#262321',
  primary: '#e3b17f',
  onPrimary: '#2a1a0b',
  textPrimary: '#ece7e1',
  textSecondary: '#a8a097',
  divider: '#2e2a26',
  error: '#ffb4ab',
  onError: '#690005',
  shadow: 'rgba(8, 5, 2, 0.45)',
} as const;

export const lightPalette = {
  background: '#f4f3f1',
  paper: '#fbfbfa',
  raised: '#ebe9e6',
  primary: '#8b5a2b',
  onPrimary: '#fbfbfa',
  textPrimary: '#1d1b19',
  textSecondary: '#5f5953',
  divider: '#e2dfdb',
  error: '#b3261e',
  onError: '#fbfbfa',
  shadow: 'rgba(60, 40, 20, 0.10)',
} as const;

// References the CSS custom properties next/font/google sets on <html> in
// src/app/layout.tsx, keeps the self-hosted fonts in sync with MUI/Tailwind.
export const typography = {
  fontDisplay: 'var(--font-bricolage), sans-serif',
  fontBody: 'var(--font-geist), sans-serif',
  fontMono: 'var(--font-geist-mono), monospace',
} as const;

// Shape rule: interactive controls (buttons, inputs, chips, segments) use
// `control`; surfaces (cards, images, panels) use `surface`. Nothing else.
export const radius = {
  control: 10,
  surface: 16,
} as const;

export const motion = {
  ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
  fast: '160ms',
} as const;
