import Axios from 'axios';
import {
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_VALIDATE_SESSION_REQUEST,
  USER_VALIDATE_SESSION_SUCCESS,
  USER_VALIDATE_SESSION_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_DETAILS_REQUEST,
USER_DETAILS_SUCCESS, 
USER_DETAILS_FAIL 
} from '../constants/userConstants';

export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
      const { data } = await Axios.post('http://localhost:5000/api/users/signin', { email, password });
      dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data)); // data includes 'children'
  } catch (error) {
      dispatch({
          type: USER_SIGNIN_FAIL,
          payload: error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
      });
  }
};

export const signout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('selectedChild'); // Clear selected child
  dispatch({ type: USER_SIGNOUT });
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put('http://localhost:5000/api/users/profile', user, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({type:USER_SIGNIN_SUCCESS,payload:data});
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const validateUserSession = () => async (dispatch) => {
  dispatch({ type: USER_VALIDATE_SESSION_REQUEST });
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      throw new Error('No user info found');
    }
    const { token } = JSON.parse(userInfo);
    const { data } = await Axios.post('http://localhost:5000/api/users/validate', { token });
    dispatch({ type: USER_VALIDATE_SESSION_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_VALIDATE_SESSION_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    localStorage.removeItem('userInfo');
  }
};

export const detailsUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_DETAILS_FAIL, payload: message });
  }
};