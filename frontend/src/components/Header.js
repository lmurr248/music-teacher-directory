import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom"; // Import Link
import PropTypes from "prop-types"; // Import PropTypes for type checking
import "../css/Header.css";

const Header = ({ marginBottom, backgroundColor }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      // Delete the cookie
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Remove the user data from localStorage
      localStorage.removeItem("user");
      setIsLoggedIn(false);

      // Navigate to the login page
      Navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const isHomePage = window.location.pathname === "/";

  return (
    <header
      className={isHomePage ? "header-bg-transparent" : "header-bg-primary"}
      style={{
        marginBottom: `-${marginBottom}px`,
      }}
    >
      <div className="header">
        <Link to="/">
          <div className="logo-container">
            <h4 className="logo">Guitar Teachers Direct</h4>
          </div>
        </Link>

        <div className="nav-links">
          <a href="#">Find Guitar Teachers</a>
          <a href="#">Teachers</a>
          {isLoggedIn && (
            <div className="user-info small">
              <p>Hi, {JSON.parse(localStorage.getItem("user")).first_name}</p>
            </div>
          )}
          {isLoggedIn ? (
            <a onClick={handleLogout} href="/login" id="login-btn">
              Log Out
            </a>
          ) : (
            <a href="/login" id="login-btn">
              Log In
            </a>
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
