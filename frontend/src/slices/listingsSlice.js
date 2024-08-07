import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const baseUrl = process.env.REACT_APP_API_BASE_URL;

const initialState = {
  listings: [],
  listing: null,
  status: "idle",
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async ({ locationId, instrumentId } = {}) => {
    // Added default parameter to handle undefined
    let query = "";
    if (locationId && instrumentId) {
      query = `?locationId=${locationId}&instrumentId=${instrumentId}`;
    } else if (locationId) {
      query = `?locationId=${locationId}`;
    } else if (instrumentId) {
      query = `?instrumentId=${instrumentId}`;
    }
    const response = await axios.get(`${baseUrl}/api/listings${query}`);
    return response.data;
  }
);

export const fetchListingById = createAsyncThunk(
  "listings/fetchListingById",
  async (id) => {
    const response = await axios.get(`${baseUrl}/api/listings/${id}`);
    return response.data;
  }
);

const listingsSlice = createSlice({
  name: "listings",
  initialState: {
    listings: [],
    listing: null,
    status: "idle",
    error: null,
  },
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
