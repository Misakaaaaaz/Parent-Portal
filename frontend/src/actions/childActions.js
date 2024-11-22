import { SET_SELECTED_CHILD } from '../constants/childConstants';

export const setSelectedChild = (child) => (dispatch) => {
  dispatch({ type: SET_SELECTED_CHILD, payload: child });
  localStorage.setItem('selectedChild', JSON.stringify(child)); // Persist selection
};