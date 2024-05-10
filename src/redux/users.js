import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers(state, { payload }) {
      return payload;
    }
  }
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
