const fetchAllInstruments = async () => {
  try {
    const response = await fetch("/api/instruments");
    if (!response.ok) {
      throw new Error("Failed to fetch instruments");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching instruments:", error);
    throw error;
  }
};

export default fetchAllInstruments;
