import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import fetchAllCategories from "../../helpers/fetchAllCategories";
import fetchAllInstruments from "../../helpers/fetchAllInstruments";
import fetchAllLocations from "../../helpers/fetchAllLocations";
import DOMPurify from "dompurify";

const AddListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [locations, setLocations] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [newLocation, setNewLocation] = useState("");

  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const data = await fetchAllInstruments();
        setInstruments(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchInstruments();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await fetchAllLocations();
        setLocations(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!id || !currentUser.id) return;

    console.log("Fetching listing with ID:", id);
    console.log("Current User ID:", currentUser.id);

    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`);
        if (!response.ok) throw new Error("Failed to fetch listing");
        const listing = await response.json();

        console.log("Fetched Listing:", listing);

        if (listing.user_id !== currentUser.id) {
          navigate("/add-listing");
        } else {
          setTitle(listing.title);
          setTagline(listing.tagline);
          setDescription(listing.description);
          setBannerImage(listing.banner_image);
          setMainImage(listing.main_image);
          setSelectedCategories(listing.categories || []);
          setSelectedInstruments(listing.instruments || []);
        }
      } catch (err) {
        console.error(err.message);
        navigate("/add-listing");
      }
    };

    fetchListing();
  }, [id, currentUser, navigate]);

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const handleTitleChange = (e) => {
    setTitle(sanitizeInput(e.target.value));
  };

  const handleTaglineChange = (e) => {
    setTagline(sanitizeInput(e.target.value));
  };

  const handleDescriptionChange = (e) => {
    setDescription(sanitizeInput(e.target.value));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerImage(null);
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setMainImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectCategories = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedCategories(selected);
  };

  const handleSelectInstruments = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedInstruments(selected);
  };

  const handleNewLocation = (e) => {
    setNewLocation(sanitizeInput(e.target.value));
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    try {
      const userId = currentUser.id;
      const newLocationData = newLocation ? { name: newLocation } : null;
      let endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/listings`;
      let method = "POST";

      if (id) {
        endpoint = `${process.env.REACT_APP_API_BASE_URL}/api/listings/${id}`;
        method = "PUT";
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user_id: userId,
          title: sanitizeInput(title),
          description: sanitizeInput(description),
          banner_image: bannerImage,
          main_image: mainImage,
          categories: selectedCategories,
          instruments: selectedInstruments,
          location: selectedLocation,
          new_location: newLocationData
            ? sanitizeInput(newLocationData.name)
            : null,
          tagline: sanitizeInput(tagline),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create/update listing: ${errorText}`);
      }

      const updatedListing = await response.json();
      console.log("Updated listing:", updatedListing);

      if (id) {
        navigate(`/listing/${id}`);
      } else {
        navigate("/listings");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <Header />

      <main>
        <div>
          <h1>Add Listing</h1>
          <form onSubmit={handleCreateListing}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Listing title"
              required
            />
            <label htmlFor="tagline">Tagline</label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={tagline}
              onChange={handleTaglineChange}
              placeholder="Listing tagline"
              maxLength={50}
              required
            />
            <div className="char-counter">{tagline?.length}/50</div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter the main text for your listing here..."
              required
            ></textarea>
            <label htmlFor="banner_image">Banner Image</label>
            <input
              type="file"
              id="banner_image"
              name="banner_image"
              onChange={handleBannerImageChange}
              required
            />
            <label htmlFor="main_image">Main Image</label>
            <input
              type="file"
              id="main_image"
              name="main_image"
              onChange={handleMainImageChange}
              required
            />
            <label htmlFor="categories">Categories</label>
            <select
              id="categories"
              name="categories"
              multiple
              onChange={handleSelectCategories}
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label htmlFor="instruments">Instruments</label>
            <select
              id="instruments"
              name="instruments"
              multiple
              onChange={handleSelectInstruments}
              required
            >
              {instruments.map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.name}
                </option>
              ))}
            </select>

            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              onChange={handleLocationChange}
              value={selectedLocation}
              required
            >
              <option value="" disabled>
                Select a location...
              </option>
              <option value="Add New">Add New</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {selectedLocation === "Add New" && (
              <div>
                <label htmlFor="new-location">New location</label>
                <input
                  type="text"
                  id="new-location"
                  name="new-location"
                  placeholder="Add a new location"
                  onChange={handleNewLocation}
                />
              </div>
            )}

            <button type="submit">
              {id ? "Update Listing" : "Add Listing"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddListing;
