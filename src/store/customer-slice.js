import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customer',
  initialState: { slidebarIsVisible: true },
  reducers: {
    setCustomers(state, action) {
      state.customersData = action.payload.customersData;
    },
  },
});

export const uiActions = customerSlice.actions;

export default customerSlice;
