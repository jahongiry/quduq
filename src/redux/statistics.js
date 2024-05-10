import { createSlice } from '@reduxjs/toolkit';

const statisticSlice = createSlice({
  name: 'statistics',
  initialState: [],
  reducers: {
    setStatistics(state, { payload }) {
      return payload;
    }
  }
});

export const { setStatistics } = statisticSlice.actions;
export default statisticSlice.reducer;
