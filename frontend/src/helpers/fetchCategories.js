import { useState, useEffect } from "react";

const useCategories = (listingId) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!listingId) return;
      try {
        const response = await fetch(`/api/listings/categories/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {}
    };

    fetchCategories();
  }, [listingId]);

  return { categories };
};

export default useCategories;
