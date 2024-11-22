// frontend/src/Survey.js
import './styles/Survey.css';
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    RadialLinearScale
} from 'chart.js';

ChartJS.register(
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    RadialLinearScale
);

function Survey({ data }) {
    if (!data || data.length === 0) return <div>Loading...</div>;

    // Prepare the data for the Radar chart
    const radarData = {
        labels: ['H', 'P', 'A', 'L', 'F', 'S'],
        datasets: data.map((item, index) => ({
            label: `Student ${item['No.']}`,
            data: ['H', 'P', 'A', 'L', 'F', 'S'].map(key => item[key]),
            backgroundColor: index === 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
            borderColor: index === 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }))
    };

    // Define chart options
    const options = {
        scales: {
            r: {
                angleLines: {
                    display: false
                },
                suggestedMin: 0,
                suggestedMax: 50
            }
        }
    };

    return (
        <div className="Survey">
            <div className=".snapshot-1724858910120-1-png-1">
                <Radar data={radarData} options={options} />
            </div>
            <div className="survey-results-1">
                Survey Results
            </div>
        </div>
    );
}

export default Survey;
