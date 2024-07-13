import { useState, useEffect } from "react";

const useLocations = (listingId) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!listingId) return;
      try {
        const response = await fetch(`/api/locations/listing/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, [listingId]);

  return { locations };
};

export default useLocations;
