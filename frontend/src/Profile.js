import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { detailsUser, updateUserProfile } from './actions/userActions';
import './styles/Account.css';
import qifan from './resources/images/qifan.jpg';
import CameraIcon from './resources/images/Camera.png';
import { USER_UPDATE_PROFILE_RESET } from './constants/userConstants';
import axios from 'axios';
const AccountPage = () => {

  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [mobileNumber,setMoblieNumber] = useState('');
  const [residentialAddress,setResidentialAddress] = useState('');
  const [educationalBackground,setEducationalBackground] = useState('');
  const [occupationalArea,setOccupationalArea] = useState('');
  const [annualEducationBudget,setAnnualEducationBudget] = useState('');
  const [notes,setNotes] = useState('');
  const [preferredFoE,setPreferredFoe] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(qifan); // Display the default avatar initially

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector(state => state.userUpdateProfile);
  const {success:successUpdate, error:errorUpdate, loading:loadingUpdate} = userUpdateProfile;

  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  useEffect(() => {
    if(!user){
      dispatch({type:USER_UPDATE_PROFILE_RESET});
      dispatch(detailsUser(userInfo._id));
    } else{
      setName(user.name);
      setEmail(user.email);
      setMoblieNumber(user.mobileNumber);
      setResidentialAddress(user.residentialAddress);
      setAnnualEducationBudget(user.annualEducationBudget);
      setEducationalBackground(user.educationalBackground);
      setPreferredFoe(user.preferredFoE);
      setOccupationalArea(user.occupationalArea);
      setNotes(user.notes);
      if (user.avatar) {
        setAvatarPreview(user.avatar); // If the user already has an avatar, display it
      }
    }
    
  }, [dispatch, userInfo._id,user]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };


  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditedInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result); // Store the base64 image data
        setAvatarPreview(reader.result); // Update the avatar preview on the page
      };
      reader.readAsDataURL(file); // Convert the image to base64
    }
  };


  const handleSave = (e) => {
    // console.log('Saving user info:', editedInfo);
    dispatch(updateUserProfile({userId:user._id,
      name,
      email,
      mobileNumber,
      residentialAddress,
      annualEducationBudget,
      educationalBackground,
      occupationalArea,
      notes,
      avatar,

    }))
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const SuccessModal = ({ onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content-edit">
        <h3>Success!</h3>
        <p>Your information has been updated successfully.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
  
  if (!userInfo) {
    return <p>Please log in to view your account details.</p>;
  }

  const handlePasswordChange = async () => {
    // Check if the new password matches the confirm password
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
  
    // Check if the new password is the same as the old password
    if (oldPassword === newPassword) {
      alert("The new password cannot be the same as your current password. Please choose a different password.");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Pass the user's token for authentication
        },
        body: JSON.stringify({
          userId: userInfo._id,
          oldPassword,
          newPassword,
        }),
      });
  
      if (response.ok) {
        alert('Password changed successfully! Please log in with your new password.');
  
        // Clear the user's session data
        localStorage.removeItem('userInfo');
        dispatch({ type: 'USER_SIGNOUT' });
  
        // Redirect to the login page
        window.location.href = '/signin'; // or use your router's navigation method
      } else {
        const data = await response.json();
        alert(`Failed to change password: ${data.message}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };
  
  
  
  
  
  return (
    <div className="account-container">
      <h1 className="account-title" style={{ color: '#000000', fontFamily: 'Nunito' }}>Account</h1>
      <p className="account-dec" style={{ color: '#000000', fontFamily: 'Nunito' }}>Here is your account details!</p>
      <div className="account-card">
        <div className="account-details">
          <div className="left-section">
            <div className="avatar-section">
              <img
              src={avatarPreview} // Display the avatar image preview
              alt="User Avatar"
              className="avatar"
            />

              <div className='avatar-flag'></div>
              <div className='avatar-btn-list'>
              <input
              type="file"
              id="avatarInput"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileChange} // Handle the file selection
            />
              <button
              className="avatar-btn-upload"
              onClick={() => document.getElementById('avatarInput').click()}
            >
                  Upload New
                </button>
                <button>Delete Avatar</button>
              </div>
            </div>
            <div className="info-item">
                <label>
                  <span>First Name</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={name.split(' ')[0]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="info-item">
                <label>
                  <span>Last Name</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={name.split(' ')[1]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="info-item">
                <label>
                  <span>Email</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="info-item">
                <label>
                  <span>Mobile Number</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input

                type="mobileNumber"
                name="mobileNumber"
                value={mobileNumber}
                onChange={(e)=>setMoblieNumber(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

            
            <div className="info-textarea-item">
              <label>Residential Address</label>
              <textarea
                type="residentialAddress"
                name="residentialAddress"
                value={residentialAddress}
                onChange={(e)=>setResidentialAddress(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="right-section">
          <div className="info-item">
            <label>
              <span>Educational Background</span>
            </label>
            <input
              type="educationalBackground"
              name="educationalBackground"
              value={educationalBackground}
              onChange={(e)=>setEducationalBackground(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="info-item">
            <label>
              <span>Occupational Area</span>
            </label>
            <input
              type="occupationalArea"
              name="occupationalArea"
              value={occupationalArea}
              onChange={(e)=>setOccupationalArea(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="info-item">
            <label>
              <span>Annual Education Budget</span>
            </label>
            <input
              type="annualEducationBudget"
              name="annualEducationBudget"
              value={annualEducationBudget}
              onChange={(e)=>setAnnualEducationBudget(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="info-item">
  <label>Preferred FoE</label>
  {isEditing ? (
    <div className="preferred-foe">
      {preferredFoE && preferredFoE.length > 0 ? (
        preferredFoE.map((foe, index) => (
          <div className='foe-item' key={index} style={{ background: '#fff' }}>
            <div className="foe-item-index">{index + 1}</div>
            <input
              type='text'
              name='foe'
              value={foe}
              onChange={(e) => {
                const newPreferredFoE = [...preferredFoE];
                newPreferredFoE[index] = e.target.value;
                setPreferredFoe(newPreferredFoE);
              }}
            />
          </div>
        ))
      ) : (
        <p>No preferred FoE</p>
      )}
    </div>
  ) : (
    <div className="preferred-foe">
      {preferredFoE && preferredFoE.length > 0 ? (
        preferredFoE.map((foe, index) => (
          <div className='foe-item' key={index}>
            <div className="foe-item-index">{index + 1}</div>
            <div className="foe-item-value">{foe}</div>
          </div>
        ))
      ) : (
        <p>No preferred FoE</p>
      )}
    </div>
  )}
</div>
            <div className="info-textarea-item">
              <label>Notes</label>
              <textarea
                type="notes"
                name="notes"
                value={notes}
                onChange={(e)=>setNotes(e.target.value)}
                disabled={!isEditing}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="action-buttons">
          {isEditing ? (
            <button onClick={handleSave}>Save Changes</button>
          ) : (
            <>
              <button onClick={handleEdit}>Edit Information</button>
              <button style={{ width: 'fit-content' }} onClick={() => setShowPasswordModal(true)}>Change Password</button>
            </>
            
          )}
        </div>
      </div>
      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div style = {{marginBottom:20}}className="modal-content">
            <h2 style={{fontFamily: 'nunito', fontSize: 25}}>Change Password</h2>
            <div className="password-input-group">
              <label style = {{fontFamily:'nunito', fontWeight:700, fontsize:23}} htmlFor="oldPassword">Old Password:</label>
              <input
                id="oldPassword"
                type="password"
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="password-input-group">
              <label style = {{fontFamily:'nunito', fontWeight:700, fontsize:23}} htmlFor="newPassword">New Password:</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="password-input-group">
              <label style={{fontFamily:'nunito', fontWeight:700}} htmlFor="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="modal-actions" style={{marginBottom: '20px'}}>
              <button style = {{fontsize: 15}} onClick={handlePasswordChange}>Save Password</button>
              <button style = {{fontsize: 15}} onClick={() => setShowPasswordModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;