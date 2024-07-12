import { useState, useEffect } from "react";

const useInstruments = (listingId) => {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    const fetchInstruments = async () => {
      if (!listingId) return;
      try {
        const response = await fetch(`/api/listings/instruments/${listingId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch instruments");
        }
        const data = await response.json();
        setInstruments(data);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    fetchInstruments();
  }, [listingId]);

  return { instruments };
};

export default useInstruments;
