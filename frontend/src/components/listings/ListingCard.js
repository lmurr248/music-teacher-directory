import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import useCategories from "../../helpers/fetchCategories";
import useInstruments from "../../helpers/useInstruments";

// Helper function to normalise titles
const normaliseTitle = (title) => {
  if (typeof title !== "string") return "";
  return title.toLowerCase().replace(/\s/g, "-");
};

const ListingCard = ({ listing }) => {
  const { categories } = useCategories(listing.id);
  const { instruments } = useInstruments(listing.id);

  const displayedInstruments = instruments.slice(0, 2);
  const extraInstruments = instruments.length - 2;

  const displayedCategories = categories.slice(0, 3);
  const extraCategories = categories.length - 3;

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
          {instruments.length > 0 ? (
            <div className="instrument-list">
              {displayedInstruments.map((instrument) => (
                <span key={instrument.id} className="instrument-item">
                  {instrument.name}
                </span>
              ))}
              {extraInstruments > 0 && (
                <span className="instrument-item">+{extraInstruments}</span>
              )}
            </div>
          ) : (
            <div className="instrument-list">
              <span className="instrument-item">No instruments found</span>
            </div>
          )}
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
          <p>{listing.tagline}</p>
        </div>
        {categories.length > 0 ? (
          <div className="card-footer">
            <div className="category-list">
              {displayedCategories.map((category) => (
                <span key={category.id} className="category-item">
                  {category.name}
                </span>
              ))}
              {extraCategories > 0 && (
                <span className="category-item">+{extraCategories}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="card-footer">
            <div className="category-list">
              <span className="category-item">No categories found</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
