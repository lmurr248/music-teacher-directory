import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchListingById, clearSingleListing } from "../slices/listingsSlice";
import "../css/ListingDetails.css";
import Header from "./Header";

// Helper function to normalize titles
const normalizeTitle = (title) => title.toLowerCase().replace(/ /g, "-");

const ListingDetails = () => {
  const { title } = useParams();
  const dispatch = useDispatch();
  const { listing, status, error } = useSelector((state) => state.listings);

  useEffect(() => {
    const fetchListing = async () => {
      const response = await fetch("http://localhost:5000/api/listings");
      const data = await response.json();
      const matchedListing = data.find(
        (listing) => normalizeTitle(listing.title) === title
      );

      if (matchedListing) {
        dispatch(fetchListingById(matchedListing.id));
      }
    };

    fetchListing();
  }, [title, dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>{error}</div>;
  if (!listing) return <div>Listing not found</div>;

  return (
    <div>
      <Header marginBottom={0} backgroundColor="#007bff" />{" "}
      <main>
        <div className="banner">
          <img src={listing.banner_image} alt={listing.title} />
        </div>
        <div className="profile-image">
          <img
            src={listing.main_image}
            alt={listing.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "fallback-image-url.jpg";
            }}
          />
        </div>
        <h1>{listing.title}</h1>
        <p>{listing.description}</p>
      </main>
    </div>
  );
};

export default ListingDetails;
