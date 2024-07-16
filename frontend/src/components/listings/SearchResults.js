import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListings } from "../../slices/listingsSlice";
import Header from "../Header";
import ListingCard from "./ListingCard";
import ListingCardSkeleton from "../ListingCardSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import fetchLocationsWithListings from "../../helpers/fetchLocationsWithListings";
import fetchInstrumentsWithListings from "../../helpers/fetchInstrumentsWithListings";

const SearchResults = () => {
  const { locationId, instrumentId } = useParams();
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.listings);
  const status = useSelector((state) => state.listings.status);
  const error = useSelector((state) => state.listings.error);
  const [locations, setLocations] = useState([]);
  const [locationsError, setLocationsError] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [instrumentsError, setInstrumentsError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(locationId || "");
  const [selectedInstrument, setSelectedInstrument] = useState(
    instrumentId || ""
  );
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [instrumentsLoading, setInstrumentsLoading] = useState(true);
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
        const data = await fetchLocationsWithListings();
        setLocations(data);
      } catch (error) {
        setLocationsError(error.message);
      } finally {
        setLocationsLoading(false);
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
      } finally {
        setInstrumentsLoading(false);
      }
    };

    fetchInstruments();
  }, []);

  useEffect(() => {
    dispatch(fetchListings({ locationId, instrumentId }));
  }, [locationId, instrumentId, dispatch]);

  useEffect(() => {
    if (locationId) {
      setSelectedLocation(locationId);
    }
  }, [locationId]);

  useEffect(() => {
    if (instrumentId) {
      setSelectedInstrument(instrumentId);
    }
  }, [instrumentId]);

  // Find location name based on selectedLocation
  const selectedLocationName = locationsLoading
    ? "Loading..."
    : locations.find((loc) => loc.id === parseInt(selectedLocation))?.name ||
      "Unknown Location";

  // Find instrument name based on selectedInstrument
  const selectedInstrumentName = instrumentsLoading
    ? "Loading..."
    : instruments.find((inst) => inst.id === parseInt(selectedInstrument))
        ?.name || "Unknown Instrument";

  // Render listings or skeleton loaders
  let content;

  if (status === "loading") {
    // Render skeleton loaders while loading
    content = (
      <div className="listing-container">
        {[1, 2, 3, 4, 5].map((index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (status === "succeeded") {
    console.log("Fetched listings:", listings);
    // Render actual listings once loaded
    content = (
      <div className="listing-container">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <p>No listings found for the selected filters.</p>
        )}
      </div>
    );
  } else if (status === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <Header marginBottom={60} backgroundColor={"transparent"} />
      <div className="hero-search">
        <div className="hero-body">
          <div className="search">
            <h4 id="your-search">Your search:</h4>
            <div className="input-container">
              <p className="x-small white">Location:</p>
              <select
                value={selectedLocation}
                onChange={handleLocationChange}
                required
              >
                <option value="">Select a location</option>
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
              <select
                value={selectedInstrument}
                onChange={handleInstrumentChange}
                required
              >
                <option value="">I want to learn...</option>
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
      <main>
        <h2 className="centered mg-top">
          {locationsLoading || instrumentsLoading
            ? "Loading search results..."
            : `Showing ${selectedInstrumentName} teachers in ${selectedLocationName}`}
        </h2>
        {content}
      </main>
    </div>
  );
};

export default SearchResults;
