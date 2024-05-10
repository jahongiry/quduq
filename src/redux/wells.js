import { createSlice } from '@reduxjs/toolkit';

const wellSlice = createSlice({
  name: 'wells',
  initialState: [],
  reducers: {
    setWells(state, { payload }) {
      return payload;
    }
  }
});

export const { setWells } = wellSlice.actions;
export default wellSlice.reducer;
