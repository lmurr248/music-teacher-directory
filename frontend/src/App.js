import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Listings from "./components/Listings";
import ListingDetails from "./components/ListingDetails";
import Login from "./components/Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Listings />} />
          <Route path="/listing/:title" element={<ListingDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
