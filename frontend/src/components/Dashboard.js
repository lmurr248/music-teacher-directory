import React, { useState, useEffect } from "react";
import Header from "./Header";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("user").id;
        const response = await fetch(
          `http://localhost:5000/api/user/${userId}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const renderUserContent = () => {
    switch (user.user_type) {
      case 1:
        return <h1>Admin Dashboard</h1>;
      case 2:
        return <h1>Teacher Dashboard</h1>;
      case 3:
        return <h1>Student Dashboard</h1>;
      default:
        return <div>Unknown user type</div>;
    }
  };

  return (
    <div>
      <Header />
      <main>
        <div>{renderUserContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
