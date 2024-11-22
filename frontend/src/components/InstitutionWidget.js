import React, { useState, useEffect } from 'react';
import './styles/InstitutionWidget.css';
import { useSelector } from 'react-redux';

// Institution logos (unchanged)
const institutionLogos = {
  UMelb: require('../resources/logo/umelb.jpg'),
  UNSW: require('../resources/logo/unsw.png'),
  USYD: require('../resources/logo/USYD.jpg'),
  UTS: require('../resources/logo/uts.jpg'),
};

const institutionNameMapping = {
  "University of Melbourne": "UMelb",
  "University of New South Wales": "UNSW",
  "University of Sydney": "USYD",
  "University of Technology Sydney": "UTS",
};
const defaultLogo = require('../resources/logo/USYD.jpg');

const InstitutionWidget = () => {
  const [originalInstitutions, setOriginalInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedChildState = useSelector((state) => state.selectedChild);
  const { child: selectedChild } = selectedChildState || {};

  useEffect(() => {
    if (selectedChild && selectedChild._id) {
      fetchStudentInstitutionData(selectedChild._id);
    } else {
      setIsLoading(false);
      setError(null);
      setOriginalInstitutions([]);
    }
  }, [selectedChild]);

  const fetchStudentInstitutionData = async (studentId) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching data for student ID:', studentId);
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/institutions`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data);
      setOriginalInstitutions(data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInstitutionLogo = (institutionName) => {
    const abbreviation = institutionNameMapping[institutionName] || institutionName;
    return institutionLogos[abbreviation] || defaultLogo;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedChild || !selectedChild._id) return <div>No student selected</div>;

  return (
    <div className="widget-container">
      <div className="title-1">Institutions</div>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : originalInstitutions.length === 0 ? (
          <p>No institutions found for the selected student.</p>
        ) : (
          <ul className="institution-list-container">
            {originalInstitutions.map((inst) => (
              inst.courses.map((course) => (
                <li key={`${inst.institution._id}-${course._id}`} className="institution-container">
                  
                  <div className="rank-container">
                    <p className="overall-rank-container">Overall Rank: #{inst.institution.rank}</p>
                    <p className="subject-rank-container">Subject Rank: #{course.rank}</p>
                  </div>

                  <div className="institution-logo-container-1">
                    <img
                      src={getInstitutionLogo(inst.institution.name)}
                      alt={`${inst.institution.name} logo`}
                      className="institution-logo"
                    />
                  </div>
                  
                  <div className="institution-name-container">
                    <div className="institution-name">{inst.institution.name}</div>
                  </div>

                  <div className="course-container">
                    <div className="course-name">{course.name}</div>
                  </div>

                </li>
              ))
            ))}
          </ul>
        )}
    </div>
  );
};

export default InstitutionWidget;