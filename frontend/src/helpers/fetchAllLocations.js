const fetchAllLocations = async () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  console.log("Base URL (locations):", baseUrl);
  try {
    const response = await fetch(`${baseUrl}/api/locations`);
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
