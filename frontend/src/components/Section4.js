import React from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './styles/Section4.css';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

ChartJS.defaults.plugins.legend.display = false;  // Disable legend globally for all charts

function Section4({ data }) {
  if (!data || data.length === 0) return <div>Loading...</div>;

  const chartData = {
    labels: ['Q1', 'Q2', 'Q3'],
    datasets: data.map((student, index) => ({
      label: `Student`,
      data: [student.Q1, student.Q2, student.Q3],
      borderColor: index === 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
      tension: 0.1
    })),
  };

  const chartOptions = {
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
      className="rectangle-10"
    >
      <h2 className='thinking'>Creativity/Lateral Thinking</h2>
      <div className="line-chart">
        <Line data={chartData} />
      </div>
      <motion.div className="total-scores">
        {data.map((student, index) => (
          <motion.div
            key={index}
            className="score-card"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <p>Total Score: {student.Total}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Section4;