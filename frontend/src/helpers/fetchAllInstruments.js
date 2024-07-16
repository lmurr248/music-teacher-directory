const fetchAllInstruments = async () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  console.log("Base URL (instruments):", baseUrl);
  try {
    const response = await fetch(`${baseUrl}/api/instruments`);
    if (!response.ok) {
      throw new Error("Failed to fetch instruments");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchAllInstruments;
