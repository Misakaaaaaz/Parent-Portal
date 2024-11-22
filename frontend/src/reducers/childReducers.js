import { SET_SELECTED_CHILD } from '../constants/childConstants';

export const selectedChildReducer = (state = { child: null }, action) => {
  switch (action.type) {
    case SET_SELECTED_CHILD:
      return { child: action.payload };
    default:
      return state;
  }
};