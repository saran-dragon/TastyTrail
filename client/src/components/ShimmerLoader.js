import React from "react";
import "./ShimmerLoader.css";

const ShimmerLoader = () => {
  return (
    <div className="sushi-loader-wrapper">
      <svg
        className="sushi-bounce"
        width="80"
        height="80"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="#f0f0f0" />
        <rect x="30" y="30" width="40" height="40" rx="10" fill="#ffa07a" />
        <circle cx="50" cy="50" r="10" fill="#2e8b57" />
      </svg>
      {/* <p>Rolling your sushi...</p> */}
    </div>
  );
};

export default ShimmerLoader;
