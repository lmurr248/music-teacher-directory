import React from "react";
import ContentLoader from "react-content-loader";

const LoadingListingCard = () => (
  <ContentLoader
    speed={2}
    width={300}
    height={400}
    viewBox="0 0 300 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    {/* Card banner image placeholder */}
    <rect x="0" y="0" rx="10" ry="10" width="100%" height="150" />

    {/* Title and tagline placeholders */}
    <rect x="0" y="170" rx="3" ry="3" width="100%" height="15" />
    <rect x="0" y="190" rx="3" ry="3" width="100%" height="15" />

    {/* Instrument list placeholder */}
    <rect x="0" y="220" rx="3" ry="3" width="80%" height="15" />

    {/* Category list placeholder */}
    <rect x="0" y="250" rx="3" ry="3" width="60%" height="15" />
  </ContentLoader>
);

export default LoadingListingCard;
