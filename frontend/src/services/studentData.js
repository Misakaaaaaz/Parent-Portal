import axios from 'axios';

export const fetchStudentData = (linkingCode) => 
  axios.get(`http://localhost:5000/api/student-data?linkingCode=${linkingCode}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
export const fetchStudentDataById = (studentId) =>
    axios.get(`http://localhost:5000/api/student-data/${studentId}`)
        .then(response => response.data)
        .catch(error => {
            console.error('Error fetching data:', error);
            throw error;
        });

export const fetchRecentEmotion = async (linkingCode) => {
  const response = await axios.get(`http://localhost:5000/api/emotion/${linkingCode}`);
  return response.data;
};
