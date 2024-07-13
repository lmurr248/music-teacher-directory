import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchListingById } from "../../slices/listingsSlice";
import "../../css/ListingDetails.css";
import Header from "../Header";
import useCategories from "../../helpers/fetchCategories";
import useInstruments from "../../helpers/useInstruments";
import useLocations from "../../helpers/fetchLocations";

const normalizeTitle = (title) => title.toLowerCase().replace(/ /g, "-");

const ListingDetails = () => {
  const { title } = useParams();
  const dispatch = useDispatch();
  const { listing, status, error } = useSelector((state) => state.listings);

  const { categories } = useCategories(listing?.id);
  const { instruments } = useInstruments(listing?.id);
  const { locations } = useLocations(listing?.id);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listings");
        const data = await response.json();
        const matchedListing = data.find(
          (listing) => normalizeTitle(listing.title) === title
        );

        if (matchedListing) {
          dispatch(fetchListingById(matchedListing.id));
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      }
    };

    fetchListing();
  }, [title, dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>{error}</div>;
  if (!listing) return <div>Listing not found</div>;

  return (
    <div>
      <Header marginBottom={0} backgroundColor="#007bff" />{" "}
      <main>
        <div className="listing-details-page">
          <div className="banner">
            <img src={listing.banner_image} alt={listing.title} />
          </div>
          <div className="listing-container-details">
            <div className="listing-meta">
              <div className="profile-image">
                <img
                  src={listing.main_image}
                  alt={listing.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "fallback-image-url.jpg";
                  }}
                />
              </div>
              <div className="listing-title">
                <h1>{listing.title}</h1>
                <p>{listing.tagline}</p>
                <div className="listing-info">
                  <div className="listing-specifics">
                    <p className="small">
                      <strong>Genres:</strong>{" "}
                      {categories.map((category) => category.name).join(", ")}
                    </p>
                    <p className="small">
                      <strong>Instruments:</strong>{" "}
                      {instruments
                        .map((instrument) => instrument.name)
                        .join(", ")}
                    </p>
                    <p className="small">
                      <strong>Location:</strong>{" "}
                      {locations.map((location) => location.name).join(", ")}
                    </p>
                  </div>
                  <div className="listing-contact">
                    <button>Contact Now</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="listing-description">
              <h2>About</h2>
              <p>{listing.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetails;
