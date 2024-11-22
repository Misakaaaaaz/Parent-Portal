import React, { useState, useEffect } from 'react';
import './styles/InstitutionStyle.css';
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

const FilterComponent = ({ onFilterChange, filterType, filterValue }) => {
  const handleFilterTypeChange = (e) => {
    onFilterChange(e.target.value, filterValue);
  };

  const handleFilterValueChange = (e) => {
    onFilterChange(filterType, e.target.value);
  };

  return (
    <div className="filter-component">
      <select value={filterType} onChange={handleFilterTypeChange}>
        <option value="none">No Filter</option>
        <option value="location">Location</option>
        <option value="subject">Subject</option>
      </select>
      {filterType !== 'none' && (
        <input
          type="text"
          value={filterValue}
          onChange={handleFilterValueChange}
          placeholder={`Enter ${filterType}...`}
        />
      )}
    </div>
  );
};

const StudentsInstitutions = () => {
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('none');
  const [filterValue, setFilterValue] = useState('');
  const [originalInstitutions, setOriginalInstitutions] = useState([]);

  // Use the global selected child from Redux
  const selectedChildState = useSelector((state) => state.selectedChild);
  const { child: selectedChild } = selectedChildState;

  useEffect(() => {
    if (selectedChild) {
      fetchStudentInstitutionData(selectedChild._id);
    }
  }, [selectedChild]);

  const fetchStudentInstitutionData = async (studentId) => {
    try {
      console.log('Fetching data for student ID:', studentId);
      const response = await fetch(`http://localhost:5000/api/students/${studentId}/institutions`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }
      const data = await response.json();
      console.log('Received data:', data);
      setFilteredInstitutions(data);
      setOriginalInstitutions(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    console.log('Filter changed:', type, value);
    setFilterType(type);
    setFilterValue(value);
    
    if (originalInstitutions.length === 0) {
      console.log('No institutions data to filter');
      return;
    }
  
    let filteredInsts = [...originalInstitutions];
    console.log('Original institutions:', filteredInsts);
  
    if (type === "location" && value) {
      filteredInsts = filteredInsts.filter(inst => {
        const match = inst.institution.address.toLowerCase().includes(value.toLowerCase());
        console.log(`Filtering institution ${inst.institution.name} by location: ${match}`);
        return match;
      });
    } else if (type === "subject" && value) {
      filteredInsts = filteredInsts.map(inst => {
        const filteredCourses = inst.courses.filter(course => 
          course.name.toLowerCase().includes(value.toLowerCase())
        );
        console.log(`Filtered courses for ${inst.institution.name}:`, filteredCourses);
        return {...inst, courses: filteredCourses};
      }).filter(inst => inst.courses.length > 0);
    }
  
    console.log('Filtered institutions:', filteredInsts);
    setFilteredInstitutions(filteredInsts);
  };
  const getInstitutionLogo = (institutionName) => {
    const abbreviation = institutionNameMapping[institutionName] || institutionName;
    return institutionLogos[abbreviation] || defaultLogo;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedChild) return <div>No student selected</div>;

  return (
    <div className="students-container">
      <div className="institution-fee-title">Institution Fees</div>
      <div className="institution-fee-comment">
        You can find the Australian universities' Institution Fees here!
      </div>

      <FilterComponent
        onFilterChange={handleFilterChange}
        filterType={filterType}
        filterValue={filterValue}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : filteredInstitutions.length === 0 ? (
        <p>No matching institutions found for the selected student.</p>
      ) : (
        <ul className="institutions-list">
          {filteredInstitutions.map((inst) => (
            inst.courses.map((course) => (
                <div key={`${inst.institution._id}-${course._id}`} className="institution-item">

                  <div className="institution-left">
                    <div className="overall-rank">Overall Rank: #{inst.institution.rank}</div>
                    <div className="subject-rank">Subject Rank: #{course.rank}</div>
                  </div>

                  <div className="institution-main">
                    <div className="institution-logo-container">
                      <img
                          src={getInstitutionLogo(inst.institution.name)}
                          alt={`${inst.institution.name} logo`}
                          className="university-logo"
                      />
                    </div>
                    <div className="institution-info-container">
                      <div className="institution-name">{inst.institution.name}</div>

                    </div>

                    <div className="institution-address-container">
                      <div className="institution-address">{inst.institution.address}</div>

                    </div>

                    <div className="course-container">
                      <div className="course-title">{course.name}</div>
                    </div>

                    <div className="course-fee-container">
                      <div className="fees">
                        <p className="domestic-fee">Domestic: ${course.domestic_fee}</p>
                        <p className="international-fee">International: ${course.international_fee}</p>
                      </div>
                    </div>
                  </div>
                </div>
            ))
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentsInstitutions;