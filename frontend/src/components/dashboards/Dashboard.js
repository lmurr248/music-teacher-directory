import React, { useState, useEffect } from "react";
import Header from "../Header";
import TeacherDashboard from "./TeacherDashboard";
import { jwtDecode } from "jwt-decode";
import ListingCardSkeleton from "../ListingCardSkeleton";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoadingUser(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await fetch(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const fetchedUserData = await response.json();
        setUser(fetchedUserData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUserListings = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/listings/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      try {
        if (!response.ok) {
          throw new Error("Failed to fetch user listings");
        }

        const listingsData = await response.json();
        setListings(listingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchUserListings();
  }, [user]);

  // Handle loading state
  if (loadingUser && !user) {
    return (
      <div>
        <Header />
        <div>
          <TeacherDashboard user={user} listings={[]} />
        </div>
      </div>
    );
  }

  if (loadingListings) {
    return (
      <div>
        <Header />
        <TeacherDashboard user={user} listings={[]} />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  // Render user content once user and listings are loaded
  return (
    <div>
      <Header />
      <TeacherDashboard user={user} listings={listings} />
    </div>
  );
};

export default Dashboard;
