import React, { useEffect, useState } from "react";
import fetchAllLocations from "../../helpers/fetchAllLocations";
import fetchAllInstruments from "../../helpers/fetchAllInstruments";
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
    navigate(`/search/${selectedLocation}/${selectedInstrument}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllLocations();
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
        const data = await fetchAllInstruments();
        setInstruments(data);
      } catch (error) {
        setInstrumentsError(error.message);
      }
    };

    fetchInstruments();
  }, []);

  // if (locationsError) return <p>Error loading locations: {locationsError}</p>;
  // if (instrumentsError)
  //   return <p>Error loading instruments: {instrumentsError}</p>;

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
            <select defaultValue="" onChange={handleLocationChange}>
              <option value="" disabled={!selectedLocation}>
                Select a location
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-container">
            <p className="x-small white">Instrument:</p>
            <select defaultValue="" onChange={handleInstrumentChange}>
              <option value="" disabled>
                I want to learn...
              </option>
              {instruments.map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.name}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default HomePageSearch;
