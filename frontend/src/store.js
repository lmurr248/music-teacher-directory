import { configureStore } from "@reduxjs/toolkit";
import listingsReducer from "./slices/listingsSlice";

export const store = configureStore({
  reducer: {
    listings: listingsReducer,
  },
});
