import React, { useEffect, useState } from 'react';
import LeftBubble from './LeftBubble';
import RightBubble from './RightBubble';
import CareerInfoWindow from './CareerInfoWindow';
import axios from 'axios';
import './CareerOrientation.css';

const CareerOrientation = () => {
    const [careerData, setCareerData] = useState({ recommended: [], notRecommended: [] });
    const [selectedCareer, setSelectedCareer] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/careerFields/all-careers');
                console.log("Fetched career data:", response.data);
                setCareerData(response.data);
            } catch (error) {
                console.error('Error fetching career data:', error);
            }
        };
        fetchData();
    }, []);

    const handleBubbleClick = (career) => {
        console.log("Bubble clicked, received career data:", career);
        setSelectedCareer(career.field);
    };

    const handleCloseInfoWindow = () => {
        console.log("Closing CareerInfoWindow");
        setSelectedCareer(null);
    };

    return (
        <div className="career-orientation-container">
            <h1 className="career-orientation-title">Career Orientation</h1>
            <p className="career-orientation-comment">
                Explore your child's current interests and how they've evolved over time.
            </p>

            <div className="recommendation-sections">
                <div className="recommendation-section">
                    <div className="recommendation-title">Recommended ✅</div>
                    <div className="bubble-chart">
                        <LeftBubble data={careerData.recommended} isLeft={true} onBubbleClick={handleBubbleClick}/>
                    </div>
                </div>
                <div className="recommendation-section">
                    <div className="recommendation-title">Not Recommended ⚠️</div>
                    <div className="bubble-chart">
                        <RightBubble data={careerData.notRecommended} isLeft={false} onBubbleClick={handleBubbleClick}/>
                    </div>
                </div>
            </div>

            {selectedCareer && (
                <CareerInfoWindow field={selectedCareer} onClose={handleCloseInfoWindow} />
            )}
        </div>
    );
};

export default CareerOrientation;