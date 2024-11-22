// InstitutionWidget.test.js
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import InstitutionWidget from '../src/components/InstitutionWidget';
import '@testing-library/jest-dom';

// Mock the fetch function
global.fetch = jest.fn();

// Mock the redux store
const mockStore = configureStore([]);

// Mock the institution logos
jest.mock('../src/resources/logo/umelb.jpg', () => 'mocked-umelb-logo');
jest.mock('../src/resources/logo/unsw.png', () => 'mocked-unsw-logo');
jest.mock('../src/resources/logo/USYD.jpg', () => 'mocked-usyd-logo');
jest.mock('../src/resources/logo/uts.jpg', () => 'mocked-uts-logo');

describe('InstitutionWidget Component', () => {
  let store;
  let originalError;
  let originalLog;

  beforeEach(() => {
    store = mockStore({
      selectedChild: {
        child: { _id: 'testStudentId' }
      }
    });
    fetch.mockClear();

    // Mock console.error and console.log
    originalError = console.error;
    originalLog = console.log;
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    // Restore console.error and console.log
    console.error = originalError;
    console.log = originalLog;
  });

  test('renders loading state initially', async () => {
    // Mock a delayed response
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve([]) }), 100)));

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the loading state to resolve
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  test('renders error state when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error: API Error')).toBeInTheDocument();
    });
  });

  test('renders institutions when fetch succeeds', async () => {
    const mockInstitutions = [
      {
        institution: { _id: 'inst1', name: 'University of Melbourne', rank: 1 },
        courses: [{ _id: 'course1', name: 'Computer Science', rank: 5 }]
      },
      {
        institution: { _id: 'inst2', name: 'University of Sydney', rank: 2 },
        courses: [{ _id: 'course2', name: 'Engineering', rank: 8 }]
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockInstitutions,
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Institutions')).toBeInTheDocument();
      expect(screen.getByText('University of Melbourne')).toBeInTheDocument();
      expect(screen.getByText('University of Sydney')).toBeInTheDocument();
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Overall Rank: #1')).toBeInTheDocument();
      expect(screen.getByText('Subject Rank: #5')).toBeInTheDocument();
      expect(screen.getByText('Overall Rank: #2')).toBeInTheDocument();
      expect(screen.getByText('Subject Rank: #8')).toBeInTheDocument();
    });
  });

  test('renders no institutions found message when data is empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No institutions found for the selected student.')).toBeInTheDocument();
    });
  });

  test('renders institutions with unknown logo', async () => {
    const mockInstitutions = [
      {
        institution: { _id: 'inst3', name: 'Unknown University', rank: 3 },
        courses: [{ _id: 'course3', name: 'Physics', rank: 10 }]
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockInstitutions,
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Unknown University')).toBeInTheDocument();
      expect(screen.getByText('Physics')).toBeInTheDocument();
      expect(screen.getByText('Overall Rank: #3')).toBeInTheDocument();
      expect(screen.getByText('Subject Rank: #10')).toBeInTheDocument();
      // Check if the default logo is used
      const logo = screen.getByAltText('Unknown University logo');
      expect(logo).toHaveAttribute('src', 'mocked-usyd-logo');
    });
  });

  test('renders correctly when selectedChild is undefined', async () => {
    const emptyStore = mockStore({
      selectedChild: {
        child: undefined
      }
    });

    await act(async () => {
      render(
        <Provider store={emptyStore}>
          <InstitutionWidget />
        </Provider>
      );
    });

    expect(screen.getByText('No student selected')).toBeInTheDocument();
  });

  test('handles fetch error with specific status', async () => {
    fetch.mockRejectedValueOnce({ status: 404, message: 'Not Found' });

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error: Not Found')).toBeInTheDocument();
    });
  });

  test('renders institutions with multiple courses', async () => {
    const mockInstitutions = [
      {
        institution: { _id: 'inst1', name: 'University of Melbourne', rank: 1 },
        courses: [
          { _id: 'course1', name: 'Computer Science', rank: 5 },
          { _id: 'course2', name: 'Mathematics', rank: 3 }
        ]
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockInstitutions,
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('University of Melbourne')).toHaveLength(2);
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
      expect(screen.getAllByText('Overall Rank: #1')).toHaveLength(2);
      expect(screen.getByText('Subject Rank: #5')).toBeInTheDocument();
      expect(screen.getByText('Subject Rank: #3')).toBeInTheDocument();
    });
  });

  test('handles network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  test('renders institutions with known logos', async () => {
    const mockInstitutions = [
      {
        institution: { _id: 'inst1', name: 'University of Melbourne', rank: 1 },
        courses: [{ _id: 'course1', name: 'Computer Science', rank: 5 }]
      },
      {
        institution: { _id: 'inst2', name: 'University of New South Wales', rank: 2 },
        courses: [{ _id: 'course2', name: 'Engineering', rank: 8 }]
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockInstitutions,
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      const uMelbLogo = screen.getByAltText('University of Melbourne logo');
      const unswLogo = screen.getByAltText('University of New South Wales logo');
      expect(uMelbLogo).toHaveAttribute('src', 'mocked-umelb-logo');
      expect(unswLogo).toHaveAttribute('src', 'mocked-unsw-logo');
    });
  });

  test('handles HTTP error with status code', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error: HTTP error! status: 500')).toBeInTheDocument();
    });
  });

  test('renders with empty selectedChild object', async () => {
    const emptyStore = mockStore({
      selectedChild: {
        child: {}
      }
    });

    await act(async () => {
      render(
        <Provider store={emptyStore}>
          <InstitutionWidget />
        </Provider>
      );
    });

    expect(screen.getByText('No student selected')).toBeInTheDocument();
  });

  test('renders with empty selectedChild object', async () => {
    const emptyStore = mockStore({
      selectedChild: {
        child: {}
      }
    });

    await act(async () => {
      render(
        <Provider store={emptyStore}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No student selected')).toBeInTheDocument();
    });
  });

  test('renders with null selectedChild', async () => {
    const nullStore = mockStore({
      selectedChild: {
        child: null
      }
    });

    await act(async () => {
      render(
        <Provider store={nullStore}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No student selected')).toBeInTheDocument();
    });
  });

  test('renders with undefined selectedChildState', async () => {
    const undefinedStore = mockStore({
      selectedChild: undefined
    });

    await act(async () => {
      render(
        <Provider store={undefinedStore}>
          <InstitutionWidget />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('No student selected')).toBeInTheDocument();
    });
  });
});