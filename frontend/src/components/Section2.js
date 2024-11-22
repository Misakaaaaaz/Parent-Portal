import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './styles/Section2.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Section2({ data }) {
  if (!data || data.length === 0) return <div>Loading...</div>;

  const chartData = {
    labels: ['A', 'S', 'I', 'C', 'E', 'R'],
    datasets: data.map((row, index) => ({
      label: `Student ${row['No.']}`,
      data: ['A', 'S', 'I', 'C', 'E', 'R'].map(key => row[key]),
      backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
      borderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    indexAxis: 'y', // This makes the bar chart horizontal
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Score: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        stacked: true,
      },
    },
    // plugins: {
    //   legend: {
    //     display: false  // Disable the default legend
    //   }
    // }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className='rectangle-5'
    >
      <h2 className="career">Career Orientation</h2>
      <div className="content-container">
        <div className="chart-3">
          <Bar data={chartData} options={options} />
        </div>
        <div className="text-box">
          <p>A: Artistic</p>
          <p>S: Social</p>
          <p>I: Investigative</p>
          <p>C: Conventional</p>
          <p>E: Enterprising</p>
          <p>R: Realistic</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Section2;
