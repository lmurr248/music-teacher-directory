import React, { useEffect, useState } from "react";
import useInstruments from "../../helpers/useInstruments";
import fetchAllLocations from "../../helpers/fetchAllLocations";
import fetchAllInstruments from "../../helpers/fetchAllInstruments";

const HomePageSearch = () => {
  const [locations, setLocations] = useState([]);
  const [locationsError, setLocationsError] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [instrumentsError, setInstrumentsError] = useState(null);

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

  if (locationsError) return <p>Error loading locations: {locationsError}</p>;
  if (instrumentsError)
    return <p>Error loading instruments: {instrumentsError}</p>;

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
            <select>
              <option value="" disabled>
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
            <select defaultValue="">
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
          <button>Search</button>
        </div>
      </div>
    </div>
  );
};

export default HomePageSearch;