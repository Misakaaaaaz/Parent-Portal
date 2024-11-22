import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from './actions/userActions';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from './constants/userConstants';
import './styles/test.css';
export default function ProfileScreen() {

  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [mobileNumber,setMoblieNumber] = useState('');



  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector(state => state.userUpdateProfile);
  const {success:successUpdate, error:errorUpdate, loading:loadingUpdate} = userUpdateProfile;

  const dispatch = useDispatch();
  useEffect(() => {
    if(!user){
      dispatch({type:USER_UPDATE_PROFILE_RESET});
      dispatch(detailsUser(userInfo._id));
    } else{
      setName(user.name);
      setEmail(user.email);
      setMoblieNumber(user.mobileNumber);
    }
    
  }, [dispatch, userInfo._id,user]);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({userId:user._id,name,email,mobileNumber }));
  };
  return (
    <div className="profile-container">
  <form className="form" onSubmit={submitHandler}>
    <div>
      <h1>User Profile</h1>
    </div>
    {loading ? (
      <LoadingBox></LoadingBox>
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
      <>
        {loadingUpdate && <LoadingBox></LoadingBox>}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {successUpdate && <MessageBox variant="success">Profile Updated</MessageBox>}
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            id="mobileNumber"
            type="text"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMoblieNumber(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
          ></input>
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Enter confirm password"
          ></input>
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Update
          </button>
        </div>
      </>
    )}
  </form>
</div>

  );
}