import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListings } from "../../slices/listingsSlice";

import Header from "../Header";
import ListingCard from "./ListingCard";
import ListingCardSkeleton from "../ListingCardSkeleton";
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

  // Render listings or skeleton loaders
  let content;

  if (status === "loading") {
    // Render skeleton loaders while loading
    content = (
      <div className="listing-container">
        {[1, 2, 3, 4, 5].map((index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (status === "succeeded") {
    console.log("Fetched listings:", listings);
    // Render actual listings once loaded
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
