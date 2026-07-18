import { createTheme, PaletteMode } from '@mui/material';
import { darkPalette, lightPalette, typography, radius } from './tokens';

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: isDark ? darkPalette.primary : lightPalette.primary,
        contrastText: isDark ? darkPalette.onPrimary : lightPalette.onPrimary,
      },
      secondary: {
        main: isDark ? darkPalette.secondary : lightPalette.secondary,
        contrastText: isDark ? darkPalette.onSecondary : lightPalette.onSecondary,
      },
      error: {
        main: darkPalette.error,
        contrastText: darkPalette.onError,
      },
      background: {
        default: isDark ? darkPalette.surface0 : lightPalette.background,
        paper: isDark ? darkPalette.surface1 : lightPalette.paper,
      },
      text: {
        primary: isDark ? darkPalette.onSurface : lightPalette.textPrimary,
        secondary: isDark ? darkPalette.onSurfaceVariant : lightPalette.textSecondary,
      },
      divider: isDark ? darkPalette.outlineVariant : lightPalette.divider,
    },
    typography: {
      fontFamily: typography.fontBody,
      h1: { fontFamily: typography.fontDisplay, fontWeight: 700 },
      h2: { fontFamily: typography.fontDisplay, fontWeight: 700 },
      h3: { fontFamily: typography.fontDisplay, fontWeight: 600 },
      h4: { fontFamily: typography.fontDisplay, fontWeight: 600 },
      h5: { fontFamily: typography.fontDisplay, fontWeight: 600 },
      h6: { fontFamily: typography.fontDisplay, fontWeight: 600 },
      button: { fontFamily: typography.fontBody },
      overline: { fontFamily: typography.fontMono, letterSpacing: '0.05em' },
    },
    shape: {
      borderRadius: radius.DEFAULT,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: radius.DEFAULT,
            transition: 'transform 0.1s ease',
            '&:active': { transform: 'scale(0.98)' },
          },
          outlined: {
            borderColor: isDark ? darkPalette.outlineVariant : lightPalette.divider,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            backgroundImage: 'none',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${lightPalette.divider}`,
            boxShadow: isDark
              ? `0 4px 16px rgba(61,43,31,0.3)`
              : '0 1px 4px rgba(44,24,16,0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius.DEFAULT,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
    },
  });
}
