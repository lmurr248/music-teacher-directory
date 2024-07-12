import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListings } from "../../slices/listingsSlice";

import Header from "../Header";
import ListingCard from "./ListingCard";
import HomePageSearch from "../searchBars/HomePageSearch";

// Helper function to normalise titles
export const normaliseTitle = (title) =>
  title.toLowerCase().replace(/\s/g, "-");

const Listings = () => {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.listings);
  const status = useSelector((state) => state.listings.status);
  const error = useSelector((state) => state.listings.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchListings());
    }
  }, [status, dispatch]);

  // Render listings
  let content;

  if (status === "loading") {
    content = <div>Loading...</div>;
  } else if (status === "succeeded") {
    console.log("Fetched listings:", listings);
    content = (
      <div className="listing-container">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    );
  } else if (status === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <Header marginBottom={60} backgroundColor={"transparent"} />
      <HomePageSearch />
      <main>
        <h2 className="centered mg-top">Featured Guitar Teachers</h2>
        {content}
      </main>
    </div>
  );
};

export default Listings;
