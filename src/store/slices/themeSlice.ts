import { createSlice } from '@reduxjs/toolkit';
import { PaletteMode } from '@mui/material';

interface ThemeState {
  mode: PaletteMode;
}

const initialState: ThemeState = {
  mode: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
