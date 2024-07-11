import React, { useState, useEffect } from "react";
import Header from "../Header";
import ListingCard from "../listings/ListingCard";
import TeacherDashboard from "./TeacherDashboard";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem("user");
        if (!userDataString) {
          throw new Error("User data not found in localStorage");
        }
        const userData = JSON.parse(userDataString);
        const userId = userData.id;
        const response = await fetch(`/api/user/${userId}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const fetchedUserData = await response.json();
        setUser(fetchedUserData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`/api/listings/user/${userData.id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user listings");
        }
        const listingsData = await response.json();
        setListings(listingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const renderUserContent = () => {
    switch (user.user_type) {
      case 1:
        return (
          <div>
            <h1>Admin Dashboard</h1>
          </div>
        );
      case 2:
        return <TeacherDashboard user={user} listings={listings} />;

      case 3:
        return <h1>Student Dashboard</h1>;
      default:
        return <div>Unknown user type</div>;
    }
  };

  return (
    <div>
      <Header />

      <div className="listings">{renderUserContent()}</div>
    </div>
  );
};

export default Dashboard;
