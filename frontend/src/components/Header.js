import React from "react";
import { Link } from "react-router-dom"; // Import Link
import PropTypes from "prop-types"; // Import PropTypes for type checking
import "../css/Header.css";

const Header = ({ marginBottom, backgroundColor }) => {
  return (
    <header
      style={{
        marginBottom: `-${marginBottom}px`,
        backgroundColor: backgroundColor, // Apply the backgroundColor prop
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
          <a href="/login" id="login-btn">
            Login
          </a>
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
