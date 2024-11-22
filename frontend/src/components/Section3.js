import React from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './styles/Section3.css';
// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

ChartJS.defaults.plugins.legend.display = false;  // Disable legend globally for all charts


function Section3({ data }) {
  if (!data || data.length === 0) return <div>Loading...</div>;

  // Function to determine the MBTI result
  const getMBTIResult = (student) => {
    const result = [
      student.E > student.I ? 'E' : student.I > student.E ? 'I' : '?',
      student.S > student.N ? 'S' : student.N > student.S ? 'N' : '?',
      student.T > student.F ? 'T' : student.F > student.T ? 'F' : '?',
      student.J > student.P ? 'J' : student.P > student.J ? 'P' : '?',
    ];
    return result.join('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rectangle-10"
    >
      <h2 className="title">Personality Types</h2>
      {data.map((student, index) => {
        // Extract MBTI-like result
        const mbtiResult = getMBTIResult(student);

        // Prepare the chart data
        const chartData = {
          labels: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'],
          datasets: [{
            label: `Student ${student['No.']}`,
            data: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].map(key => student[key]),
            backgroundColor: index % 2 === 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)',
            borderColor: index % 2 === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }],
        };

        const options = {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'MBTI Test Results',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          
        };

        return (
          <motion.div
  key={index}
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ delay: index * 0.2 }}
>
  {/* <h3 className="student-name-2">Student {student['No.']}</h3> */}
  <div className="chart-container">
    <Bar data={chartData} options={options} />
  </div>

  {/* Add the new container for the MBTI result */}
  <div className="mbti-result-container">
    <h4 className="subtitle">MBTI Result:</h4>
    <p className="mbti-result">{mbtiResult}</p>
  </div>
</motion.div>
        );
      })}
    </motion.div>
  );
}

export default Section3;