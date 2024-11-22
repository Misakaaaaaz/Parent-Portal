import React from 'react';
import './styles/CareerOrientation.css';

const Interests = ({ data }) => {
  // Check if data exists and is an array with enough elements
  if (!data || !Array.isArray(data) || data.length < 4) {
    return <div>No interests data available</div>;
  }

  return (
    <div className="interests">
      <div className="title-1">Career Orientation</div>
      <p>Recommended</p>
      <div className="career-container">
        <div className="recommended-no-1">No. 1</div>
        <div className="recommended-career-1">{data[0]?.name}</div>
      </div>
      <div className="career-container">
        <div className="recommended-no-2">No. 2</div>
        <div className="recommended-career-2">{data[1]?.name}</div>
      </div>
      <p>Not Recommended</p>
      <div className="career-container">
        <div className="not-recommended-no-1">No. 1</div>
        <div className="not-recommended-career-1">{data[2]?.name}</div>
      </div>
      <div className="career-container">
        <div className="not-recommended-no-2">No. 2</div>
        <div className="not-recommended-career-2">{data[3]?.name}</div>
      </div>
    </div>
  );
};

export default Interests;
