import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Import `thunk` as a named export

import { userDetailsReducer, userSigninReducer, userUpdateProfileReducer } from './reducers/userReducers';
import { selectedChildReducer } from './reducers/childReducers'; // Ensure this file exists and is correctly imported

const initialState = {
  userSignin: {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
  },
  selectedChild: {
    child: localStorage.getItem('selectedChild')
      ? JSON.parse(localStorage.getItem('selectedChild'))
      : null,
  },
};

const reducer = combineReducers({
  userSignin: userSigninReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userDetails: userDetailsReducer,
  selectedChild: selectedChildReducer, // Include this in your combined reducers
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
