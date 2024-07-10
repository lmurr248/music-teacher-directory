import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  listings: [],
  listing: null,
  status: "idle",
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async () => {
    const response = await axios.get("http://localhost:5000/api/listings");
    return response.data;
  }
);

export const fetchListingById = createAsyncThunk(
  "listings/fetchListingById",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/listings/${id}`
    );
    return response.data;
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    clearSingleListing(state) {
      state.singleListing = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchListingById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.listing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearSingleListing } = listingsSlice.actions;

export default listingsSlice.reducer;
