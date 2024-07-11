import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";

// Helper function to normalise titles
const normaliseTitle = (title) => {
  if (typeof title !== "string") return "";
  return title.toLowerCase().replace(/\s/g, "-");
};

const ListingCard = ({ listing }) => {
  if (!listing || !listing.title) {
    return null; // or handle the case where listing or title is not available
  }

  return (
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
  );
};

export default ListingCard;
