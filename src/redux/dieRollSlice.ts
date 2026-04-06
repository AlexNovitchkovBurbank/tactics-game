import { createSlice } from "@reduxjs/toolkit";

const dieRollResultSlice = createSlice({
  name: "dieRollResult",
  initialState: { value: 0 },
  reducers: {
    setDieRollResult: (state, action) => {
      state.value = action.payload;
    },
  }
});

export const { setDieRollResult } = dieRollResultSlice.actions;

export default dieRollResultSlice.reducer;