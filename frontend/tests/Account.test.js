// AccountPage.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountPage from '../src/Account';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { detailsUser, updateUserProfile } from '../src/actions/userActions';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';


// Mock actions
jest.mock('../src/actions/userActions', () => ({
  detailsUser: jest.fn(),
  updateUserProfile: jest.fn(),
}));

// Mock images
jest.mock('../src/resources/images/qifan.jpg', () => 'qifan.jpg');
jest.mock('../src/resources/images/Camera.png', () => 'Camera.png');

// Create a mock Redux store
const middlewares = [thunk];
const mockStore = configureStore([]); // <-- Use configureMockStore

describe('AccountPage Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      userSignin: {
        userInfo: {
          _id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: null,
        },
      },
      userDetails: {
        loading: false,
        error: null,
        user: {
          _id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          mobileNumber: '1234567890',
          residentialAddress: '123 Main St',
          annualEducationBudget: '10000',
          educationalBackground: 'Bachelor',
          preferredFoE: ['Engineering', 'Science'],
          occupationalArea: 'Engineer',
          notes: 'Some notes',
        },
      },
      userUpdateProfile: {
        success: false,
        error: null,
        loading: false,
      },
    });

    store.dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("The logged-in user's account page should be rendered correctly", () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );

    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Here is your account details!')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeDisabled();
  });

  it('Clicking on the "Edit Information" button should allow you to edit the information.', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );

    fireEvent.click(screen.getByText(/Edit Information/i));

    expect(screen.getByLabelText(/First Name/i)).not.toBeDisabled();
    expect(screen.getByText(/Save Changes/i)).toBeInTheDocument();
  });

  it('Clicking “Save Changes” should call updateUserProfile action', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Jane' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      residentialAddress: '123 Main St',
      annualEducationBudget: '10000',
      educationalBackground: 'Bachelor',
      occupationalArea: 'Engineer',
      notes: 'Some notes',
    });
  });

  it('When the user is not logged in, a login prompt should be displayed', () => {
    // Recreate the store with the user not logged in
    store = mockStore({
      userSignin: {
        userInfo: null,
      },
      userDetails: {
        loading: false,
        error: null,
        user: null,
      },
      userUpdateProfile: {
        success: false,
        error: null,
        loading: false,
      },
    });

    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );

    expect(screen.getByText('Please log in to view your account details.')).toBeInTheDocument();
  });

  it('Change Email', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: '123@123.com' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: '123@123.com',
      mobileNumber: '1234567890',
      residentialAddress: '123 Main St',
      annualEducationBudget: '10000',
      educationalBackground: 'Bachelor',
      occupationalArea: 'Engineer',
      notes: 'Some notes',
    });
  });

  it('Change Mobile Number', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), {
      target: { value: '123123123' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '123123123',
      residentialAddress: '123 Main St',
      annualEducationBudget: '10000',
      educationalBackground: 'Bachelor',
      occupationalArea: 'Engineer',
      notes: 'Some notes',
    });
  });

  it('Change Residental Address', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/Residential Address/i), {
      target: { value: 'White House' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      residentialAddress: 'White House',
      annualEducationBudget: '10000',
      educationalBackground: 'Bachelor',
      occupationalArea: 'Engineer',
      notes: 'Some notes',
    });
  });

  it('Clicking “Save Changes” should call updateUserProfile action', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/Annual Education Budget/i), {
      target: { value: '1' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      residentialAddress: '123 Main St',
      annualEducationBudget: '1',
      educationalBackground: 'Bachelor',
      occupationalArea: 'Engineer',
      notes: 'Some notes',
    });
  });

  it('Clicking “Save Changes” should call updateUserProfile action', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/Educational Background/i), {
      target: { value: 'PHD' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      residentialAddress: '123 Main St',
      annualEducationBudget: '10000',
      educationalBackground: 'PHD',
      occupationalArea: 'Engineer',
      notes: 'Some notes',
    });
  });

  it('Clicking “Save Changes” should call updateUserProfile action', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/Occupational Area/i), {
      target: { value: 'Psychology' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      residentialAddress: '123 Main St',
      annualEducationBudget: '10000',
      educationalBackground: 'Bachelor',
      occupationalArea: 'Psychology',
      notes: 'Some notes',
    });
  });

  it('Clicking “Save Changes” should call updateUserProfile action', () => {
    render(
      <Provider store={store}>
        <AccountPage />
      </Provider>
    );
  
    fireEvent.click(screen.getByText(/Edit Information/i));
  
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: '123' },
    });
  
    fireEvent.click(screen.getByText(/Save Changes/i));
  
    expect(updateUserProfile).toHaveBeenCalledWith({
      userId: '123',
      name: 'John Doe',
      email: 'john@example.com',
      mobileNumber: '1234567890',
      residentialAddress: '123 Main St',
      annualEducationBudget: '10000',
      educationalBackground: 'Bachelor',
      occupationalArea: 'Engineer',
      notes: '123',
    });
  });
});
