import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CareerInfoWindow.css';

function CareerInfoWindow({ field, onClose }) {
    const [careerData, setCareerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (field) {
            const fetchCareerInfo = async () => {
                const url = `http://localhost:5000/api/careerFields/career-info/${encodeURIComponent(field)}`;
                console.log(`Fetching data for career field: ${field}`);
                console.log(`Request URL: ${url}`);
                try {
                    const response = await axios.get(url);
                    console.log('API Response:', response.data);
                    setCareerData(response.data);
                    setLoading(false);
                } catch (err) {
                    console.error('Error details:', err);
                    setError(`Failed to fetch career information: ${err.response?.data?.message || err.message}`);
                    setLoading(false);
                }
            };

            fetchCareerInfo();
        } else {
            setError("No career field specified");
            setLoading(false);
        }
    }, [field]);

    if (loading) return <div className="career-info-background"><div className="career-info-container">Loading...</div></div>;
    if (error) return <div className="career-info-background"><div className="career-info-container">{error}</div></div>;
    if (!careerData) return null;

    const salaryChartData = careerData.salaryRange.map(item => ({
        name: item.role,
        lowest: item.lowest,
        highest: item.highest
    }));

    return (
        <div className="career-info-background">
            <div className="career-info-container">
                <div className="close-button-container">
                    <button className="close-button" onClick={onClose} aria-label="Close"></button>
                </div>
                <div className="career-icon-with-title">
                    <img
                        src={`data:image/png;base64,${careerData.icon_data}`}
                        alt="Career Icon"
                        className="specific-career-icon"
                    />
                    <div className="career-title">{careerData.field}</div>
                </div>

                <div className="content-grid">
                    <div className="left-column">
                        <section>
                            <div className="description">Description:</div>
                            <p className="description-text">{careerData.description}</p>
                        </section>

                        <section>
                            <div className="career-paths">Career Paths:</div>
                            <div className="career-paths-list">
                                {careerData.careerPaths.map((path, index) => (
                                    <li key={index} className="career-path-item">{path}</li>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="salary-range">Salary Range:</div>
                            <div className="salary-range-chart" data-testid="salary-range-chart">
                                <ResponsiveContainer width="100%" height={290}>
                                    <BarChart
                                        data={salaryChartData}
                                        margin={{
                                            top: 20,
                                            right: 10,
                                            left: 10
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name" axisLine={true} tick={false}/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Bar dataKey="lowest" fill="#8884d8" name="Lowest Salary"/>
                                        <Bar dataKey="highest" fill="#82ca9d" name="Highest Salary"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>
                    </div>

                    <div className="right-column">
                        <section>
                            <h3 className="recommended-courses-title">Related Courses:</h3>
                            {careerData.recommendedCourses.map((course, index) => (
                                <div key={index} className="recommended-courses-rectangle">
                                    <div className="school-icon"></div>
                                    <div className="recommended-course-degree-text">{course.degree}</div>
                                    <div className="recommended-course-major">Major: {course.major}</div>
                                    <div className="recommended-course-offered">Offered: {course.institution}</div>
                                </div>
                            ))}
                        </section>

                        <section className="alumni-testimonial">
                            <img
                                src={`data:image/png;base64,${careerData.alumniTestimonial.image_data}`}
                                alt="Alumni"
                                className="alumni-testimonial-avatar-image"
                            />
                            <div className="alumni-testimonial-name-with-title">
                                <div className="alumni-testimonial-name">{careerData.alumniTestimonial.name}</div>
                                <div className="alumni-testimonial-title">{careerData.alumniTestimonial.title}</div>
                                <div className="alumni-testimonial-quote">"{careerData.alumniTestimonial.quote}"</div>
                            </div>
                        </section>

                        <section>
                            <div className="upcoming-events">Upcoming Events:</div>
                            <div className="upcoming-events-rectangle-text-input">
                                {careerData.upcomingEvents.map((event, index) => (
                                    <li key={index}>
                                        <a href={event.link}>{event.title}</a>
                                    </li>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CareerInfoWindow;