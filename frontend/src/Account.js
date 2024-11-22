import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { detailsUser, updateUserProfile } from './actions/userActions';
import './styles/Account.css';
import qifan from './resources/images/qifan.jpg';
import CameraIcon from './resources/images/Camera.png';
import { USER_UPDATE_PROFILE_RESET } from './constants/userConstants';

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



  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector(state => state.userUpdateProfile);
  const {success:successUpdate, error:errorUpdate, loading:loadingUpdate} = userUpdateProfile;

  const dispatch = useDispatch();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  
  useEffect(() => {
    if(!user){
      dispatch({type:USER_UPDATE_PROFILE_RESET});
      if (userInfo && userInfo._id) {
        dispatch(detailsUser(userInfo._id));
      }
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
    }
    
  }, [dispatch, userInfo,user]);
  
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
      notes
    }))
    setIsEditing(false);
  };
  
  if (!userInfo) {
    return <p>Please log in to view your account details.</p>;
  }
  
  return (
    <div className="account-container">
      <h1 className="account-title" style={{ color: '#000000', fontFamily: 'Nunito' }}>Account</h1>
      <p className="account-dec" style={{ color: '#000000', fontFamily: 'Nunito' }}>Here is your account details!</p>
      <div className="account-card">
        <div className="account-details">
          <div className="left-section">
            <div className="avatar-section">
              <img
                src={userInfo.avatar ? userInfo.avatar : qifan}
                alt="User Avatar"
                className="avatar"
              />
              <div className='avatar-flag'>
                <img src= {CameraIcon} alt="" className="icon"/>
              </div>
              <div className='avatar-btn-list'>
                <button className='avatar-btn-upload'>Upload New</button>
                <button>Delete Avatar</button>
              </div>
            </div>
            <div className="info-item">
                <label htmlFor="firstName">
                  <span>First Name</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input
                id="firstName"
                  type="text"
                  name="firstName"
                  value={name.split(' ')[0]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="info-item">
                <label htmlFor='lastName'>
                  <span>Last Name</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input
                id = 'lastName'
                  type="text"
                  name="lastName"
                  value={name.split(' ')[1]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="info-item">
                <label htmlFor='Email'>
                  <span>Email</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input
                id='Email'
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="info-item">
                <label htmlFor='mobileNumber'>
                  <span>Mobile Number</span>
                  <span style={{color: '#BF202C'}}>*</span>
                </label>
                <input
                id = 'mobileNumber'
                type="mobileNumber"
                name="mobileNumber"
                value={mobileNumber}
                onChange={(e)=>setMoblieNumber(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

            
            <div className="info-textarea-item">
              <label htmlFor='residentialAddress'>
                <span>Residential Address</span>
                </label>
              <input
                id='residentialAddress'
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
            <label htmlFor='educationalBackground'>
              <span>Educational Background</span>
            </label>
            <input
            id = 'educationalBackground'
              type="educationalBackground"
              name="educationalBackground"
              value={educationalBackground}
              onChange={(e)=>setEducationalBackground(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="info-item">
            <label htmlFor='occupationalArea'>
              <span>Occupational Area</span>
            </label>
            <input
            id = 'occupationalArea'
              type="occupationalArea"
              name="occupationalArea"
              value={occupationalArea}
              onChange={(e)=>setOccupationalArea(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="info-item">
            <label htmlFor='annualEducationBudget'>
              <span>Annual Education Budget</span>
            </label>
            <input
            id = 'annualEducationBudget'
              type="annualEducationBudget"
              name="annualEducationBudget"
              value={annualEducationBudget}
              onChange={(e)=>setAnnualEducationBudget(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="info-item">
  <label htmlFor='preferredFoE'>Preferred FoE</label>
  {isEditing ? (
    <div className="preferred-foe">
      {preferredFoE && preferredFoE.length > 0 ? (
        preferredFoE.map((foe, index) => (
          <div className='foe-item' key={index} style={{ background: '#fff' }}>
            <div className="foe-item-index">{index + 1}</div>
            <input
            id = 'preferredFoE'
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
              <label htmlFor='notes'>Notes</label>
              <textarea
              id = 'notes'
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
            <button onClick={handleEdit}>Edit Information</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;