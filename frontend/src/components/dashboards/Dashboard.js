import React, { useState, useEffect } from "react";
import Header from "../Header";
import TeacherDashboard from "./TeacherDashboard";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
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
        setLoading(false);
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
<<<<<<< HEAD
        if (!response.ok) {
          throw new Error("Failed to fetch user listings");
        }
=======
        const userData = JSON.parse(localStorage.getItem("user"));
        const response = await fetch(`/api/listings/user/${userData.id}`, {
          credentials: "include",
        });
        // if (!response.ok) {
        //   throw new Error("Failed to fetch user listings");
        // }
>>>>>>> 93b7a0fe0f9272132d5edba87bb49baab335f6f7
        const listingsData = await response.json();
        setListings(listingsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [user]);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;
  // if (!user) return <div>No user data found</div>;

  console.log(user);

  const renderUserContent = () => {
    if (!user) return <div>Loading user details...</div>;

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
