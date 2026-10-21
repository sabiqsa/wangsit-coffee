import { createTheme, PaletteMode } from '@mui/material';
import { darkPalette, lightPalette, typography, radius, motion } from './tokens';

export function createAppTheme(mode: PaletteMode) {
  const p = mode === 'dark' ? darkPalette : lightPalette;
  const transition = (...props: string[]) =>
    props.map((prop) => `${prop} ${motion.fast} ${motion.ease}`).join(', ');

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: { main: p.primary, contrastText: p.onPrimary },
      secondary: { main: p.textSecondary, contrastText: p.background },
      error: { main: p.error, contrastText: p.onError },
      background: { default: p.background, paper: p.paper },
      text: { primary: p.textPrimary, secondary: p.textSecondary },
      divider: p.divider,
    },
    typography: {
      fontFamily: typography.fontBody,
      h1: { fontFamily: typography.fontDisplay, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.02 },
      h2: { fontFamily: typography.fontDisplay, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 },
      h3: { fontFamily: typography.fontDisplay, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 },
      h4: { fontFamily: typography.fontDisplay, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 },
      h5: { fontFamily: typography.fontDisplay, fontWeight: 600, letterSpacing: '-0.015em' },
      h6: { fontFamily: typography.fontDisplay, fontWeight: 600, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600 },
      body1: { lineHeight: 1.65 },
      body2: { lineHeight: 1.6 },
      button: { fontFamily: typography.fontBody, fontWeight: 600, textTransform: 'none' },
      overline: { fontFamily: typography.fontMono, letterSpacing: '0.08em', fontWeight: 500 },
    },
    shape: {
      borderRadius: radius.control,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { WebkitFontSmoothing: 'antialiased' },
          '::selection': { backgroundColor: p.primary, color: p.onPrimary },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': { outline: `2px solid ${p.primary}`, outlineOffset: 2 },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: radius.control,
            paddingInline: 18,
            whiteSpace: 'nowrap',
            transition: transition('background-color', 'border-color', 'color', 'transform'),
            '&:active': { transform: 'scale(0.98)' },
          },
          sizeLarge: { paddingBlock: 12, paddingInline: 24, fontSize: '0.975rem' },
          contained: {
            '&:hover': { backgroundColor: `color-mix(in srgb, ${p.primary} 88%, ${p.textPrimary})` },
          },
          outlined: {
            borderColor: p.divider,
            color: p.textPrimary,
            '&:hover': { borderColor: p.primary, backgroundColor: 'transparent' },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: transition('background-color', 'color', 'transform'),
            '&:active': { transform: 'scale(0.94)' },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: radius.surface,
            backgroundImage: 'none',
            backgroundColor: p.paper,
            border: `1px solid ${p.divider}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          elevation8: { boxShadow: `0 16px 40px -12px ${p.shadow}`, border: `1px solid ${p.divider}` },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: radius.control, fontWeight: 500 },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: radius.control,
            backgroundColor: p.paper,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: p.divider },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: p.textSecondary },
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
      },
      MuiSkeleton: {
        defaultProps: { animation: 'wave' },
        styleOverrides: {
          root: { backgroundColor: p.raised },
          rectangular: { borderRadius: radius.surface },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: radius.control },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: p.textPrimary,
            color: p.background,
            fontSize: '0.75rem',
            borderRadius: radius.control,
          },
        },
      },
    },
  });
}
