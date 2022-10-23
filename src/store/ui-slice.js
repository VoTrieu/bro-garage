import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { slidebarIsVisible: true },
  reducers: {
    toggleSlidebar(state) {
      state.slidebarIsVisible = !state.slidebarIsVisible;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
