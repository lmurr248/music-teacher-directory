import React, { useEffect, useState } from "react";
import fetchLocationsWithListings from "../../helpers/fetchLocationsWithListings";
import fetchInstrumentsWithListings from "../../helpers/fetchInstrumentsWithListings";
import { useNavigate } from "react-router-dom";

const HomePageSearch = () => {
  const [locations, setLocations] = useState([]);
  const [locationsError, setLocationsError] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [instrumentsError, setInstrumentsError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const navigate = useNavigate();

  const handleInstrumentChange = (e) => {
    setSelectedInstrument(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleSearch = () => {
    if (selectedLocation && selectedInstrument) {
      navigate(`/search/${selectedLocation}/${selectedInstrument}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLocationsWithListings();
        setLocations(data);
      } catch (error) {
        setLocationsError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const data = await fetchInstrumentsWithListings();
        setInstruments(data);
      } catch (error) {
        setInstrumentsError(error.message);
      }
    };

    fetchInstruments();
  }, []);

  return (
    <div className="hero">
      <div className="hero-body">
        <h2>Find a Guitar Teacher Near You</h2>
        <p>
          Connect with guitar teachers in your area. Sign up today to find the
          perfect teacher for you!
        </p>
        <div className="search">
          <div className="input-container">
            <p className="x-small white">Location:</p>
            <select defaultValue="" onChange={handleLocationChange} required>
              <option value="" disabled>
                Select a location
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {locationsError && <p className="error">{locationsError}</p>}
          </div>
          <div className="input-container">
            <p className="x-small white">Instrument:</p>
            <select defaultValue="" onChange={handleInstrumentChange} required>
              <option value="" disabled>
                I want to learn...
              </option>
              {instruments.map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.name}
                </option>
              ))}
            </select>
            {instrumentsError && <p className="error">{instrumentsError}</p>}
          </div>
          <button
            onClick={handleSearch}
            disabled={!selectedLocation || !selectedInstrument}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePageSearch;
