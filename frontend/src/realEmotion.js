import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './styles/EmotionWidget.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const EmotionWidget = ({ recentEmotion }) => {
  const [emotionData, setEmotionData] = useState([0, 0, 0, 0, 0]);
  const [emotionPercentages, setEmotionPercentages] = useState([0, 0, 0, 0, 0]);
  const [previousEmotionPercentages, setPreviousEmotionPercentages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const emotionLabels = ['Extra Sad', 'Sad', 'Neutral', 'Happy', 'Extra Happy'];

  const calculatePercentages = (data) => {
    const total = data.reduce((acc, val) => acc + val, 0) || 1;
    return data.map((val) => (val / total) * 100);
  };

  useEffect(() => {
    setEmotionData([0, 0, 0, 0, 0]);
    setPreviousEmotionPercentages(null);
    setIsLoading(true);
    setError(null);

    if (recentEmotion) {
      const aggregatedData = [
        recentEmotion.ExtraSad || 0,
        recentEmotion.Sad || 0,
        recentEmotion.Neutral || 0,
        recentEmotion.Happy || 0,
        recentEmotion.ExtraHappy || 0,
      ];

      setEmotionData(aggregatedData);
      setIsLoading(false);
    } else {
      setError('No recent emotion data available.');
      setIsLoading(false);
    }
  }, [recentEmotion]);

  useEffect(() => {
    const percentages = calculatePercentages(emotionData);
    setEmotionPercentages(percentages);

    if (previousEmotionPercentages) {
      let maxIndex = percentages.indexOf(Math.max(...percentages));
      const previousPercentage = previousEmotionPercentages[maxIndex] || 1;
      const currentPercentage = percentages[maxIndex];

      const change = ((currentPercentage - previousPercentage) / previousPercentage) * 100;

    } else {
      const maxIndex = percentages.indexOf(Math.max(...percentages));
    }

    setPreviousEmotionPercentages([...percentages]);
  }, [emotionData]);

  const chartData = {
    labels: emotionLabels,
    datasets: [
      {
        data: emotionPercentages,
        backgroundColor: ['#8E44AD', '#3498DB', '#95A5A6', '#F1C40F', '#E74C3C'],
        borderColor: '#ffffff',
        borderWidth: 2,
        cutout: '75%',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
  };

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="emotion-widget">
      <div className="header">
        <div className="title-1">Recent Emotion</div>
        <div className="date-display">
          <p>From: <span>01-14 Mar, 2024</span></p>
        </div>
      </div>

      <div className="chart-emotion-container">
        <div className="chart-container-1">
          <div className="chart"><Doughnut data={chartData} options={chartOptions}/></div>
        </div>

        <div className="emotion-details">
          {emotionLabels.map((label, index) => (
            <div key={index} className="emotion-row">
              <span className={`color-dot emotion${index}`}></span>
              <p className="emotion-label">{label}</p>
              <p className="emotion-percentage">{emotionPercentages[index].toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionWidget;
