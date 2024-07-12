const fetchAllLocations = async () => {
  try {
    const response = await fetch("/api/locations");
    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export default fetchAllLocations;
