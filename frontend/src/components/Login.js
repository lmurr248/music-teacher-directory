import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

const Login = () => {
  return (
    // Create a log in form with email and password fields
    <div>
      <Header backgroundColor={"#007bff"} />
      <main className="login-page">
        <div className="login-form">
          <h1>Log In</h1>
          <form>
            <label>Email</label>
            <input type="email" />
            <label>Password</label>
            <input type="password" />
            <button type="submit">Log In</button>
          </form>
          <Link to="/register" className="dark">
            Don't have an account? Register here
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Login;
