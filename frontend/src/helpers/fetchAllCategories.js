const fetchAllCategories = async () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  console.log("Base URL (categories):", baseUrl);
  try {
    const response = await fetch(`${baseUrl}/api/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchAllCategories;
