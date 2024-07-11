import React, { useState } from "react";

const AddListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBannerImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setMainImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          title,
          description,
          banner_image: bannerImage,
          main_image: mainImage,
          categories: [1, 2], // Use appropriate category IDs
          instruments: [1, 2], // Use appropriate instrument IDs
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create listing");
      }
      const newListing = await response.json();
      console.log("New listing:", newListing);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
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
          />
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
          <label htmlFor="banner_image">Banner Image</label>
          <input
            type="file"
            id="banner_image"
            name="banner_image"
            onChange={handleBannerImageChange}
          />
          <label htmlFor="main_image">Main Image</label>
          <input
            type="file"
            id="main_image"
            name="main_image"
            onChange={handleMainImageChange}
          />
          <label htmlFor="categories">Categories</label>
          <select id="categories" name="categories" multiple>
            <option value="1">Category 1</option>
            <option value="2">Category 2</option>
            <option value="3">Category 3</option>
          </select>
          <label htmlFor="instruments">Instruments</label>
          <select id="instruments" name="instruments" multiple>
            <option value="1">Instrument 1</option>
            <option value="2">Instrument 2</option>
            <option value="3">Instrument 3</option>
          </select>
          <button type="submit">Add Listing</button>
        </form>
      </div>
    </main>
  );
};

export default AddListing;
