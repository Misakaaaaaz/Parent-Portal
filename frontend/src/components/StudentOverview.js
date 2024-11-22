import React from 'react';
import './styles/StudentOverview.css';

const StudentOverview = ({ data }) => (
  <div className="student-overview">
    <div className="title-1">Student Overview</div>
    <div className="student-overview-container">
      <div className = "avatar-container">
        <img src={data.imageURL} alt={`${data.name}'s avatar`} className="student-avatar" />
      </div>
      <div className="student-info-container">
        <div className="line-container">
          <div className="attribute-container">Name:</div>
          <div className="attribute-value-container">{data.name}</div>
        </div>
        <div className="line-container">
          <div className="attribute-container">Age:</div>
          <div className="attribute-value-container">{data.age}</div>
        </div>
        <div className="line-container">
          <div className="attribute-container">School:</div>
          <div className="attribute-value-container">{data.schoolName}</div>
        </div>
        <div className="line-container">
          <div className="attribute-container">Class:</div>
          <div className="attribute-value-container">{data.class}</div>
        </div>
        <div className="line-container">
          <div className="attribute-container">Grade:</div>
          <div className="attribute-value-container">{data.grade}</div>
        </div>
      </div>
        {/* <div className="attribute-container">
          <p><strong>Name:</strong></p>
          <p><strong>Age:</strong></p>
          <p><strong>School:</strong></p>
          <p><strong>Class:</strong></p>
          <p><strong>Grade:</strong></p>
        </div>
        <div className="attribute-value-container">
          <p>{data.name}</p>
          <p>{data.age}</p>
          <p>{data.schoolName}</p>
          <p>{data.class}</p>
          <p>{data.grade}</p>
        </div> */}

    </div>
  </div>
);

export default StudentOverview;