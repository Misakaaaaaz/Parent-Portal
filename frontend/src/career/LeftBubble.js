import React, { useState, useCallback } from 'react';
import './LeftBubble.css';
import { Bubble } from "react-chartjs-2";
import { Chart as ChartJS, BubbleController, LinearScale, PointElement, Tooltip } from "chart.js";

ChartJS.register(BubbleController, LinearScale, PointElement, Tooltip);

function LeftBubble({ data, isLeft, onBubbleClick }) {
    const [hoveredBubble, setHoveredBubble] = useState(null);

    const handleHover = useCallback((event, elements) => {
        if (elements && elements.length > 0) {
            setHoveredBubble(elements[0].element.options.field);
        } else {
            setHoveredBubble(null);
        }
    }, []);

    const handleClick = useCallback((event, elements) => {
        if (elements && elements.length > 0) {
            const clickedElement = elements[0].element;
            const clickedBubble = clickedElement.$context.raw;
            onBubbleClick(clickedBubble);
        } else {
            console.log("No elements clicked");
        }
    }, [onBubbleClick]);

    if (!data || data.length === 0) return <div>Loading...</div>;

    const maxRank = Math.max(...data.map(field => field.rank));

    const graphData = {
        datasets: [{
            data: data.map((career, index) => ({
                x: Math.random() * 30 + 20,
                y: (maxRank - career.rank + 1) * (100 / (maxRank + 1)),
                r: (maxRank - career.rank + 1) * 15 + 20,
                label: career.field,
                field: career.field
            })),
            backgroundColor: isLeft ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)',
            borderColor: isLeft ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
        }]
    };

    const graphOptions = {
        scales: {
            x: { display: false, min: 0, max: 100 },
            y: { display: false, min: 0, max: 100 }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => context.raw.label
                }
            }
        },
        maintainAspectRatio: false,
        onClick: handleClick,
        onHover: handleHover
    };

    return (
        <div className="left-bubble-container">
            <Bubble data={graphData} options={graphOptions} data-testid="mock-bubble-chart" />
            {hoveredBubble && (
                <div className="bubble-hover-info" data-testid="bubble-hover-info">
                    {hoveredBubble.label}
                </div>
            )}
        </div>
    );
}

export default LeftBubble;