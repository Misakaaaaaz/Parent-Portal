import React from 'react';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import './styles/Section1.css'; // Import your CSS file
import './styles/Section1.css';
import { fetchStudentDataById } from '../services/studentData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function Section1({ data }) {
  if (!data || data.length === 0) return <div>Loading...</div>;

  const chartData = {
    labels: ['H', 'P', 'A', 'L', 'F', 'S'],
    datasets: data.map((item, index) => ({
      label: `Student`,
      data: ['H', 'P', 'A', 'L', 'F', 'S'].map(key => item[key]),
      backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
      borderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true  // Ensure angle lines are displayed
        },
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: {
          display: false  // Hide tick marks if desired
        },
        pointLabels: {
          display: true,  // Ensure point labels (axes labels) are displayed
          font: {
            size: 14  // Adjust font size if necessary
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false  // Disable the default legend
      }
    }
  };

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rectangle-5"  // Apply your CSS class here
      >
        <h2 className="marks">Value</h2>
        <div className="content-container">
          <div className="radar-chart-container">
            <Radar data={chartData} options={chartOptions} />
          </div>
          <div className="text-box">
            <p>H: Homework</p>
            <p>P: Participation</p>
            <p>A: Attendance</p>
            <p>L: Late Submission</p>
            <p>F: Final Exam</p>
            <p>S: Semester Grade</p>
          </div>
        </div>
        {/* Uncomment if you need the raw data section */}
        {/* <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="data-from-1-14-mar-2028">Raw Data</h3>
        <table className="data-from-1-14-mar-2037">
          <thead>
            <tr>
              {Object.keys(data[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="student-name-1">
                {Object.values(item).map((value, cellIndex) => {
                  let cellClass = "";
                  if (value > 20) {
                    cellClass = "data-positive";
                  } else if (value < 10) {
                    cellClass = "data-negative";
                  } else {
                    cellClass = "data-neutral";
                  }

                  return <td key={cellIndex} className={cellClass}>{value}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div> */}
      </motion.div>
  );
}

export default Section1;
