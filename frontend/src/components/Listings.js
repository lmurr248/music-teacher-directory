import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListings } from "../slices/listingsSlice";
import { Link } from "react-router-dom";
import Header from "./Header";

// Helper function to normalise titles
const normaliseTitle = (title) => title.toLowerCase().replace(/\s/g, "-");

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
          <Link to={`/listing/${normaliseTitle(listing.title)}`}>
            <div key={listing.id} className="card">
              <div className="card-image">
                <img
                  src={listing.banner_image}
                  alt={listing.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-image-url.jpg";
                  }}
                />
              </div>
              <div className="main-image">
                <img
                  src={listing.main_image}
                  alt={listing.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-image-url.jpg";
                  }}
                />
              </div>
              <div className="card-header">
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } else if (status === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <Header marginBottom={60} backgroundColor={"#ffffff00"} />

      <div className="hero">
        <div className="hero-body">
          <h2>Find a Guitar Teacher Near You</h2>
          <p>
            Connect with guitar teachers in your area. Sign up today to find the
            perfect teacher for you!
          </p>
          <div className="search">
            <input type="text" placeholder="Enter your location" />
            <button>Search</button>
          </div>
        </div>
      </div>
      <main>
        <h2 className="centered mg-top">Featured Guitar Teachers</h2>
        {content}
      </main>
    </div>
  );
};

export default Listings;
