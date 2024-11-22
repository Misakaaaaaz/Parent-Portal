// AllSectionsPage.js
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Section1 from './components/Section1';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import Section4 from './components/Section4';
import axios from 'axios';
import './styles/AllSurveypages.css';

const sections = [
    {component: Section1, key: 'section1'},
    {component: Section2, key: 'section2'},
    {component: Section3, key: 'section3'},
    {component: Section4, key: 'section4'},

];

const AllSectionsPage = () => {
    const [sectionData, setSectionData] = useState({});


    const selectedChildState = useSelector((state) => state.selectedChild);
    const { child: selectedChild } = selectedChildState;

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedChild) return; // Exit if no child is selected
            try {
                const responses = await Promise.all(
                    sections.map((section) =>
                        axios.get(`http://localhost:5000/api/${section.key}`, {
                            params: { studentId: selectedChild._id }
                        })
                    )
                );
                const data = responses.reduce((acc, response, index) => {
                    acc[sections[index].key] = response.data;
                    return acc;
                }, {});
                setSectionData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedChild]);


    return (
        <div className="survey-results-title-container">
            {/* Title and Comment container */}
            <div className="survey-results-title-container">
                <div className="survey-results-title">Survey Results</div>
                <div className="survey-results-title-comment">
                    You can find the survey results of your child here!
                </div>
            </div>

            <div className="survey-results-container">
                {sections.map(({component: Component, key}) => (
                    <div key={key} className={`section-container ${key}`}>
                        <Component data={sectionData[key]}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllSectionsPage;
