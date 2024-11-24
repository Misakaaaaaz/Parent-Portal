import React from 'react';
import Plot from 'react-plotly.js';
import { useState, useEffect } from 'react';
import './styles/BoxPlotChart.css';
const BoxPlotChart = ({ data }) => {
  // Prepare the boxplot trace using quartile data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const upcomingEvents = [
    {
      eventName: "Dr. Smith",
      start: new Date("2024-11-15T10:00:00"),
      location: "Impressive problem-solving skills shown during debugging sessions. Strong team collaboration noted.",
    },
    {
      eventName: "Dr. Liu ",
      start: new Date("2024-11-20T08:00:00"),
      location: "Strong technical foundation in optimization algorithms. Continue refining reports for better clarity and detail.",
    },
    {
      eventName: "Prof. Kummerfeld",
      start: new Date("2024-12-01T09:00:00"),
      location: "Excellent project proposal for research on educational AI. Needs slight refinement on methodology clarity.",
    },
  ];
  const boxTrace = {
    type: 'box',
    x: data.map(subject => subject.name),
    q1: data.map(subject => subject.q1),
    median: data.map(subject => subject.median),
    q3: data.map(subject => subject.q3),
    lowerfence: data.map(subject => subject.min),
    upperfence: data.map(subject => subject.max),
    name: 'Cohort',
    boxpoints: false,
    // marker: { color: 'black' },
    line: { color: '#2171B7' },
    showlegend: true,
    // width: 0.5, // Set the width between 0 and 1
  };

  // Prepare the scatter trace for the student's marks
  const scatterTrace = {
    type: 'scatter',
    x: data.map(subject => subject.name),
    y: data.map(subject => subject.mark),
    mode: 'markers',
    marker: { color: '#F97171', size: 10 },
    name: 'Student Mark',
    showlegend: true,
  };

  const traces = [boxTrace, scatterTrace];

  const layout = {
    // title: 'Student Marks vs Cohort',
    xaxis: { 
      title: { 
        text: 'Subject',
        font: {
          weight: 'bold'
        }
      } , 
      type: 'category' 
    },
    yaxis: { title: 'Marks' },
    boxmode: 'group',
    boxgap: 0.5,       // Increase this value to increase the gap between boxes
    boxgroupgap: 0.5,  // Increase to add more space between groups
    paper_bgcolor: '#F8FAFE',   // Set the overall background color
    plot_bgcolor: '#F8FAFE'
  };

  return (
    <div className="subjects">
      <div className="title-1">Academic Performance</div>
      < div className="boxplot-container">
        <Plot
          data={traces}
          layout={layout}
          style={{flex: '1', display: 'flex'}}
        />
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <button className="open-modal-button" onClick={openModal}>
      Feedback and Comments
      </button>
    </div>
    {/* Modal */}
    {isModalOpen && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Teacher Feedback and Comments</h3>
      <table className="modal-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Teacher</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {upcomingEvents.map((event, index) => (
            <tr key={index}>
              <td>{event.start.toLocaleString()}</td>
              <td>{event.eventName}</td>
          
              <td>{event.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="close-modal-button" onClick={closeModal}>
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default BoxPlotChart;
