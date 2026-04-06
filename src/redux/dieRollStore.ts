import { configureStore } from "@reduxjs/toolkit";
import dieRollResultSliceReducer from "./dieRollSlice";

export const dieRollResultStore = configureStore({
  reducer: {
    dieRollResult: dieRollResultSliceReducer
  }
});

// Types for React components
export type RootState = ReturnType<typeof dieRollResultStore.getState>;
export type AppDispatch = typeof dieRollResultStore.dispatch;
