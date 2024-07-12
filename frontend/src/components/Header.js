import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../css/Header.css";
import { jwtDecode } from "jwt-decode"; // Ensure correct import of jwtDecode

const Header = ({ marginBottom, backgroundColor }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        fetchUserDetails(decoded.id, token); // Pass token as an argument to the function
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Ensure user is logged out if token is invalid
      }
    }
  }, [navigate]); // Include navigate in the dependency array

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token that's passed to the function
          "Content-Type": "application/json",
        },
      });

      const userData = await response.json();
      setUserName(userData.first_name); // Assuming the API returns an object with a first_name property
    } catch (error) {
      console.error("Error fetching user details:", error);
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      navigate("/login"); // Redirect to login if fetching user details fails
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const isHomePage = window.location.pathname === "/";

  return (
    <header
      className={isHomePage ? "header-bg-transparent" : "header-bg-primary"}
      style={{ marginBottom: `-${marginBottom}px`, backgroundColor }}
    >
      <div className="header">
        <Link to="/">
          <div className="logo-container">
            <h4 className="logo">Guitar Teachers Direct</h4>
          </div>
        </Link>
        <div className="nav-links">
          {isLoggedIn && (
            <div className="user-info small">
              <p>Hi, {userName}</p>
            </div>
          )}
          {isLoggedIn ? (
            <div className="nav-logged-in">
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </div>
          ) : (
            <div className="nav-logged-out">
              <Link to="#">Find Guitar Teachers</Link>
              <Link to="#">Teachers</Link>
              <Link to="/login" className="login-button">
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  marginBottom: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
};

export default Header;
