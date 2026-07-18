'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store, persistor } from '@/store';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { createAppTheme } from '@/lib/theme';
import { AuthProvider } from './AuthProvider';

function MuiThemeSync({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((s) => s.theme.mode);
  const theme = createAppTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MuiThemeSync>{children}</MuiThemeSync>
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}
