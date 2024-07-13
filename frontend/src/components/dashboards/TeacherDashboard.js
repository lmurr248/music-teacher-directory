import React from "react";
import { Link } from "react-router-dom";
import ListingCard from "../listings/ListingCard";
import "./dashboard.css";
import ListingCardSkeleton from "../ListingCardSkeleton";

const TeacherDashboard = ({ user, listings }) => {
  // Ensure listings is an array and check if it has any items
  if (!Array.isArray(listings) || listings.length === 0) {
    return (
      <div>
        <div className="dashboard-header-container">
          <div className="dashboard-header">
            <h1>Teacher Dashboard</h1>
            <div className="menu">
              <div className="nav">
                <a href="#">Profile</a>
                <a href="#">Account</a>
              </div>
              <Link to="/add-listing">
                <button>Add Listing</button>
              </Link>
            </div>
          </div>
        </div>
        <main>
          <h2>Your Listings</h2>
          <div className="listing-cards">
            {listings.map((listing) => (
              <div key={listing.id}>
                <ListingCardSkeleton />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Render actual listings once they are loaded
  return (
    <div>
      <div className="dashboard-header-container">
        <div className="dashboard-header">
          <h1>Teacher Dashboard</h1>
          <div className="menu">
            <div className="nav">
              <a href="#">Profile</a>
              <a href="#">Account</a>
            </div>
            <Link to="/add-listing">
              <button>Add Listing</button>
            </Link>
          </div>
        </div>
      </div>
      <main>
        <h2>Your Listings</h2>
        <div className="listing-cards">
          {listings.map((listing) => (
            <div key={listing.id}>
              <ListingCard listing={listing} />
              <Link to={`/add-listing?id=${listing.id}`}>Edit</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
