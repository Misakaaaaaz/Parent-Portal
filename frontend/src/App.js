import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import StudentOverview from './components/StudentOverview';
import Interests from './components/Interests';
import SigninScreen from './SigninScreen';
import { signout, validateUserSession } from './actions/userActions';
import Section1 from './components/Section1';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import Section4 from './components/Section4';
import Academic from './components/Academic';
import Navigation from "./Navigation";
import AllSurveypages from './AllSurveypages';
import Calendar from './components/Calendar';
import EmotionWidget from './realEmotion';
import Institutions from './components/Institution';
import AccountPage from './Profile';
import { fetchStudentDataById } from './services/studentData';
import InstitutionWidget from './components/InstitutionWidget';
import CareerOrientation from "./career/CareerOrientation";
import BoxPlotChart from './components/BoxPlotChart';
import UpcomingEvents from './components/UpcomingEvents';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Homepage = () => {
  const [studentData, setStudentData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const selectedChildState = useSelector((state) => state.selectedChild);
  const { child: selectedChild } = selectedChildState;

  useEffect(() => {
    if (selectedChild && selectedChild._id) {
      fetchStudentDataById(selectedChild._id)
        .then(setStudentData)
        .catch(console.error);
    }
  }, [selectedChild]);

  if (!studentData) return <div>Loading...</div>;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="dashboard-title-container">
      <div className="dashboard-title">Homepage</div>
      <div className="survey-results-title-comment">
        Hello! Welcome to OIC Education Parent Portal.
      </div>
      
      {/* Button to Open Modal */}
      <button className="open-modal-button" onClick={openModal}>
        Show Information
      </button>

      {/* Modal Content */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Information</h3>
            <p>This is the modal window showing some information.</p>
            <button className="close-modal-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="dashboard">
        <div className="content">
          <div className="main-content">
            <div className="top-row">
              <StudentOverview data={studentData} />
              <EmotionWidget recentEmotion={studentData.recentEmotion} />
            </div>
            <BoxPlotChart data={studentData.subjects} />
          </div>
          <div className="sidebar-dashboard">
            <Interests data={studentData.interests} />
            <UpcomingEvents studentId={selectedChild._id} />
          </div>
        </div>
      </div>
    </div>
  );
};


const App = () => {
  const dispatch = useDispatch();
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading } = userSignin;
  const location = useLocation();

  const [sectionData, setSectionData] = useState({});

  useEffect(() => {
    dispatch(validateUserSession());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          sections.map(section => 
            fetch(`http://localhost:5000/api/${section.key}`).then(res => res.json())
          )
        );
        const data = responses.reduce((acc, response, index) => {
          acc[sections[index].key] = response;
          return acc;
        }, {});
        setSectionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);

  const sections = [
    { name: 'Section 1', component: Section1, path: '/section1', key: 'section1' },
    { name: 'Section 2', component: Section2, path: '/section2', key: 'section2' },
    { name: 'Personality', component: Section3, path: '/section3', key: 'section3' },
    { name: 'Creativity', component: Section4, path: '/section4', key: 'section4' },
    { name: 'Academic', component: Academic, path: '/academic', key: 'academic' },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid-container">
        {location.pathname !== '/signin' && userInfo && <Navigation />}
     
      
      <Routes>
        <Route 
          path="/signin" 
          element={userInfo ? <Navigate to="/" /> : <SigninScreen />} 
        />
        <Route 
          path="/" 
          element={userInfo ? <Homepage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/Account" 
          element={userInfo ? <AccountPage /> : <Navigate to="/signin" />} 
        />
        <Route 
          path="/Surveys" 
          element={userInfo ? <AllSurveypages /> : <Navigate to="/signin" />} 
        />
        <Route
            path="/career_orientation"
            element={userInfo ? <CareerOrientation /> : <Navigate to="/signin" />}
        />
        <Route 
          path="/calendar"
          element={userInfo ? <Calendar /> : <Navigate to="/signin" />} 
        />
        {sections.map((section, index) => (
          <Route 
            key={index}
            path={section.path}
            element={
              userInfo ? 
              React.createElement(section.component, { data: sectionData[section.key] }) : 
              <Navigate to="/signin" />
            }
          />
        ))}
        <Route path="/institutions" element={<Institutions studentName={userInfo ? userInfo.name : 'John'} />} />
        <Route path="/signin" element={<SigninScreen />} /> {/* Signin route */}
      </Routes>
    </div>
  );
};

export default App;