import React from "react";
import ListingCard from "../listings/ListingCard";
import "./dashboard.css";

const TeacherDashboard = ({ user, listings }) => {
  // Ensure listings is defined and has a length before rendering
  if (!listings || listings.length === 0) {
    return (
      <div>
        <div className="dashboard-header">
          <h1>Teacher Dashboard</h1>
          <button>Add Listing</button>
        </div>
        <main>
          <p>Welcome, {user.first_name}</p>
          <h2>Your Listings</h2>
          <p>You have no listings</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header-container">
        <div className="dashboard-header">
          <h1>Teacher Dashboard</h1>
          <div className="menu">
            <div className="nav">
              <a>Profile</a>
              <a>Account</a>
            </div>
            <button>Add Listing</button>
          </div>
        </div>
      </div>
      <main>
        <p>Welcome, {user.first_name}</p>
        <h2>Your Listings</h2>
        <div className="listing-cards">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing}></ListingCard>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
