import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser(state, { payload }) {
      return payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
