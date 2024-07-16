import axios from "axios";

const fetchLocationsWithListings = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/listings/locations-with-listings`
  );
  return response.data;
};

export default fetchLocationsWithListings;
