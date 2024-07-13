import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState(3); // Assuming '3' is a default user type
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Login error:", errorData.message);
      }
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          userType: Number(userType),
        }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Registration error:", errorData.message);
      }
    } catch (err) {
      console.error("Error registering:", err);
    }
  };

  return (
    <div>
      <Header backgroundColor={"#007bff"} />
      <main className="login-page">
        <div className="login-form">
          <h1>{isRegister ? "Register" : "Log In"}</h1>
          <p className="small">I am a...</p>
          <div className="user-type-buttons">
            <button
              className={userType === 3 ? "selected" : ""}
              onClick={() => setUserType(3)}
            >
              Student
            </button>
            <button
              className={userType === 2 ? "selected" : ""}
              onClick={() => setUserType(2)}
            >
              Teacher
            </button>
          </div>
          <form onSubmit={isRegister ? handleRegister : handleLogin}>
            {isRegister && (
              <>
                <div className="form-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">{isRegister ? "Register" : "Log In"}</button>
          </form>
          <button
            className="plain-button"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? (
              <>
                Already have an account? <span className="blue">Log In</span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span className="blue">Register here</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
