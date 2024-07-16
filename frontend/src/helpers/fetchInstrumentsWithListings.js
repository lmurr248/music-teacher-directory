import axios from "axios";

const fetchInstrumentsWithListings = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/api/listings/instruments-with-listings`
  );
  return response.data;
};

export default fetchInstrumentsWithListings;
