import React, { useEffect, useState } from "react";
import Header from "../Header";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AddListing = () => {
  const navigate = useNavigate();
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();
  const id = query.get("id");
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
      const decoded = jwtDecode(token);
      setCurrentUser(decoded);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch categories
  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const categories = await response.json();
        setCategories(categories);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCategories();

    const fetchInstruments = async () => {
      try {
        const response = await fetch("/api/instruments");
        if (!response.ok) throw new Error("Failed to fetch instruments");
        const instruments = await response.json();
        setInstruments(instruments);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchInstruments();

    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        if (!response.ok) throw new Error("Failed to fetch locations");
        const locations = await response.json();
        setLocations(locations);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchLocations();

    const fetchLocationByListingId = async () => {
      try {
        const response = await fetch(`/api/locations/listing/${id}`);
        if (!response.ok) throw new Error("Failed to fetch location");
        const location = await response.json();
        setSelectedLocation(location[0]);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchLocationByListingId();

    if (id) {
      const fetchListing = async () => {
        try {
          const response = await fetch(`/api/listings/${id}`);
          if (!response.ok) throw new Error("Failed to fetch listing");
          const listing = await response.json();
          // Check user_id match before setting state
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
    }
  }, [currentUser, id, navigate]);

  // Handle title input changes
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTaglineChange = (e) => {
    setTagline(e.target.value);
  };

  // Handle description input changes
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Handle banner image changes
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

  // Handle main image changes
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setMainImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle category selection changes
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

  // Handle instrument selection changes
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
    setNewLocation(e.target.value);
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();

    try {
      const userId = currentUser.id;
      const newLocationData = newLocation ? { name: newLocation } : null;
      let endpoint = "/api/listings";
      let method = "POST";

      if (id) {
        endpoint = `/api/listings/${id}`;
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
          title,
          description,
          banner_image: bannerImage,
          main_image: mainImage,
          categories: selectedCategories,
          instruments: selectedInstruments,
          location: selectedLocation,
          new_location: newLocationData,
          tagline,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create/update listing");
      }

      const updatedListing = await response.json();
      console.log("Updated listing:", updatedListing);

      // Redirect or handle success based on the action (create/update)
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
              placeholder="Listing title"
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
              placeholder="Enter the main text for your listings here..."
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
