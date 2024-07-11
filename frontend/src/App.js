import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Listings from "./components/listings/Listings";
import ListingDetails from "./components/listings/ListingDetails";
import Login from "./components/Login";
import Dashboard from "./components/dashboards/Dashboard";
// import dotenv from "dotenv";
// dotenv.config();

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/listing/:title" element={<ListingDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
