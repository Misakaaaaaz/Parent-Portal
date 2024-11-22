import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Import images from the same folder
import happyImage from './happy.png';
import angryImage from './angry.png';
import sadImage from './sad.png';
import shameImage from './shame.png';

// Register the components
ChartJS.register(ArcElement, Tooltip, Legend);

const EmotionWidget = () => {
  const [emotionData, setEmotionData] = useState([40,40,10,10]);
  const [previousEmotionData, setPreviousEmotionData] = useState(null); // To store previous data
  const [currentEmotionImage, setCurrentEmotionImage] = useState(happyImage);
  const [percentageChange, setPercentageChange] = useState(0); // To store percentage change
  const [dateRange, setDateRange] = useState(''); // For the dynamic date range
  const [error, setError] = useState(null); // Error state

  // Array of imported emotion images
  const emotionImages = [
    happyImage,  // Happy image
    angryImage,  // Anger image
    sadImage,    // Sadness image
    shameImage,  // Shame image
  ];

  // Function to format date
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Function to calculate the date range dynamically
  const calculateDateRange = () => {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - 13); // 14-day range including today

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(currentDate);

    setDateRange(`From ${formattedStartDate} to ${formattedEndDate}`);
  };

  useEffect(() => {
    calculateDateRange();

    // Simulating fetching data from an API with mock data
    const fetchData = async () => {
      try {
        // Simulating fetching data from an API with mock data
        const response = await fetch('/api/emotion-data');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setEmotionData(data.emotionData || [40,40,10,10]); // Fallback to mock data
      } catch (error) {
        setError('Failed to fetch emotion data');
      }
    };

    fetchData();
  }, []);

  // Determine the highest percentage emotion and calculate the percentage change
  useEffect(() => {
    if (previousEmotionData) {
      let maxIndex = 0;
      for (let i = 1; i < emotionData.length; i++) {
        if (emotionData[i] > emotionData[maxIndex]) {
          maxIndex = i;
        }
      }

      // Set the image for the highest emotion
      setCurrentEmotionImage(emotionImages[maxIndex]);

      // Calculate the percentage change
      const previousMaxValue = previousEmotionData[maxIndex];
      const currentMaxValue = emotionData[maxIndex];
      const change = ((currentMaxValue - previousMaxValue) / previousMaxValue) * 100;
      setPercentageChange(change.toFixed(2)); // Set percentage change to 2 decimal places
    }

    // Update previous data
    setPreviousEmotionData([...emotionData]);
  }, [emotionData]);

  const chartData = {
    labels: ['Happy', 'Anger', 'Sadness', 'Shame'],
    datasets: [
      {
        data: emotionData,
        backgroundColor: ['#F7D154', '#5D3AEE', '#FF5E57', '#5AC8FA'],
        borderColor: '#ffffff',
        borderWidth: 2,
        cutout: '70%',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="emotion-widget" style={{ backgroundColor: '#F4F4F4', padding: '20px', borderRadius: '10px', width: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', position: 'relative' }}>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#233d63', marginBottom: '10px' }}>Recent Emotion</h2>
        <button style={{ backgroundColor: '#ECECEC', border: 'none', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', color: '#7D8AA3', cursor: 'pointer' }}>View more</button>
      </div>
      <p style={{ color: '#7D8AA3' }}>{dateRange}</p>

      {/* Container for doughnut chart and emotion details */}
      <div className="chart-emotion-container" style={{ display: 'flex', alignItems: 'center' }}>
        {/* Doughnut Chart */}
        <div className="chart-container" style={{ position: 'relative', height: '150px', width: '150px' }}>
          <Doughnut data={chartData} options={chartOptions} />
          <div className="emoji-container" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <img src={currentEmotionImage} alt="emotion" style={{ width: '50px', height: '50px' }} />
            <p className="percentage-change" style={{ margin: '5px 0 0', fontSize: '14px', color: percentageChange >= 0 ? '#4CAF50' : '#FF6B6B' }}>
              {percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`}
            </p>
          </div>
        </div>

        {/* Emotion details to the right of the doughnut chart */}
        <div className="emotion-details" style={{ marginLeft: '20px' }}>
          <p><span className="color-dot happy" style={{ backgroundColor: '#F7D154', width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>Happy: <span className="emotion-percentage" style={{ float: 'right' }}>{emotionData[0]}%</span></p>
          <p><span className="color-dot anger" style={{ backgroundColor: '#5D3AEE', width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>Anger: <span className="emotion-percentage" style={{ float: 'right' }}>{emotionData[1]}%</span></p>
          <p><span className="color-dot sadness" style={{ backgroundColor: '#FF5E57', width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>Sadness: <span className="emotion-percentage" style={{ float: 'right' }}>{emotionData[2]}%</span></p>
          <p><span className="color-dot shame" style={{ backgroundColor: '#5AC8FA', width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>Shame <span className="emotion-percentage" style={{ float: 'right' }}>{emotionData[3]}%</span></p>
        </div>
      </div>
    </div>
  );
};

export default EmotionWidget;
