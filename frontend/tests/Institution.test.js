import React from 'react';
import { render, screen, fireEvent, waitFor,act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import StudentsInstitutions from '../src/components/Institution';
import '@testing-library/jest-dom';
// Mock the fetch function
global.fetch = jest.fn();

// Mock the Redux store
const mockStore = configureStore([]);

// Mock the useSelector hook
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

// Mock the institution logos
jest.mock('../src/resources/logo/umelb.jpg', () => 'mocked-umelb-logo');
jest.mock('../src/resources/logo/unsw.png', () => 'mocked-unsw-logo');
jest.mock('../src/resources/logo/USYD.jpg', () => 'mocked-usyd-logo');
jest.mock('../src/resources/logo/uts.jpg', () => 'mocked-uts-logo');

describe('StudentsInstitutions Component', () => {
  let store;
  const mockStudent = {
    name: 'John Doe',
    institutions: [
      {
        institution: {
          name: 'University of Melbourne',
          rank: 1,
          address: '123 Melbourne St'
        },
        courses: [
          {
            name: 'Computer Science',
            rank: 1,
            duration: '3 years',
            international_fee: 50000,
            domestic_fee: 30000
          }
        ]
      }
    ]
  };


  beforeEach(() => {
    store = mockStore({
      selectedChild: {
        child: { _id: '123', name: 'Test Student' }
      }
    });

    // Mock the useSelector to return the store state
    require('react-redux').useSelector.mockImplementation(callback => {
      return callback(store.getState());
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Normal case : renders loading state initially', () => {
    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('Normal case :fetches and displays institutions data', async () => {
    const mockData = [
      {
        institution: { _id: '1', name: 'University of Melbourne', rank: 1, address: 'Parkville VIC 3010' },
        courses: [{ _id: '101', name: 'Computer Science', rank: 1, domestic_fee: 10000, international_fee: 20000 }]
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("You can find the Australian universities' Institution Fees here!")).toBeInTheDocument();
      expect(screen.getByText('University of Melbourne')).toBeInTheDocument();
      expect(screen.getByText('Computer Science')).toBeInTheDocument();
    });
  });

  it('Normal case : filters institutions by location', async () => {
    const mockData = [
      {
        institution: { _id: '1', name: 'University of Melbourne', rank: 1, address: 'Parkville VIC 3010' },
        courses: [{ _id: '101', name: 'Computer Science', rank: 1, domestic_fee: 10000, international_fee: 20000 }]
      },
      {
        institution: { _id: '2', name: 'University of Sydney', rank: 2, address: 'Camperdown NSW 2006' },
        courses: [{ _id: '102', name: 'Engineering', rank: 2, domestic_fee: 11000, international_fee: 22000 }]
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("You can find the Australian universities' Institution Fees here!")).toBeInTheDocument();
    });

    // Change filter type to location
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'location' } });

    // Enter filter value
    fireEvent.change(screen.getByPlaceholderText('Enter location...'), { target: { value: 'VIC' } });

    await waitFor(() => {
      expect(screen.getByText('University of Melbourne')).toBeInTheDocument();
      expect(screen.queryByText('University of Sydney')).not.toBeInTheDocument();
    });
  });

  it('Edge case : handles case when there are no institutions to filter', async () => {
    // Mock an empty data response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <StudentsInstitutions />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("You can find the Australian universities' Institution Fees here!")).toBeInTheDocument();
    });

    // Check for the message displayed when no institutions are found
    expect(screen.getByText('No matching institutions found for the selected student.')).toBeInTheDocument();

    // Check that the filter component is still rendered
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('No Filter')).toBeInTheDocument();
  });
  it('Normal case : filters institutions by subject', async () => {
    const mockData = [
      {
        institution: { _id: '1', name: 'University of Melbourne', rank: 1, address: 'Melbourne, VIC' },
        courses: [{ _id: '101', name: 'Computer Science', rank: 1, domestic_fee: 10000, international_fee: 20000 }]
      },
      {
        institution: { _id: '2', name: 'University of Sydney', rank: 2, address: 'Sydney,NSW' },
        courses: [{ _id: '102', name: 'Engineering', rank: 2, domestic_fee: 11000, international_fee: 22000 }]
      }
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("You can find the Australian universities' Institution Fees here!")).toBeInTheDocument();
    });

    // Change filter type to subject
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'subject' } });

    // Enter filter value
    fireEvent.change(screen.getByPlaceholderText('Enter subject...'), { target: { value: 'Computer' } });

    await waitFor(() => {
      expect(screen.getByText('University of Melbourne')).toBeInTheDocument();
      expect(screen.queryByText('University of Sydney')).not.toBeInTheDocument();
    });
  });
  it('Edge case : handles filtering when there are no institutions', async () => {
    // Mock an empty data response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const consoleSpy = jest.spyOn(console, 'log');

    await act(async () => {
      render(
        <Provider store={store}>
          <StudentsInstitutions />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("You can find the Australian universities' Institution Fees here!")).toBeInTheDocument();
    });

    // Attempt to filter with no institutions
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'location' } });
    
    // Check if the console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('No institutions data to filter');

    // Check that the "No matching institutions" message is still displayed
    expect(screen.getByText('No matching institutions found for the selected student.')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('Abnormal case : handles fetch error when response is not ok', async () => {
    // Mock a failed fetch response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    const consoleSpy = jest.spyOn(console, 'error');

    await act(async () => {
      render(
        <Provider store={store}>
          <StudentsInstitutions />
        </Provider>
      );
    });

    await waitFor(() => {
      // Check if the error message is displayed
      expect(screen.getByText('Error: Failed to fetch student data')).toBeInTheDocument();
    });

    // Check if the error was logged to console
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching student data:', expect.any(Error));

    // Check if the error message includes the correct text
    expect(consoleSpy.mock.calls[0][1].message).toBe('Failed to fetch student data');

    consoleSpy.mockRestore();
  });

  it('Normal case : renders correct logo for known institution', async () => {
    const mockData = [
      {
        institution: {
          _id: 'inst1',
          name: 'University of New South Wales',
          rank: 1,
          address: 'Sydney NSW 2052'
        },
        courses: [
          {
            _id: 'course1',
            name: 'Computer Science',
            rank: 1,
            duration: '3 years',
            international_fee: 50000,
            domestic_fee: 30000
          }
        ]
      }
    ];
  
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });
  
    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );
  
    await waitFor(() => {
      const logo = screen.getByAltText('University of New South Wales logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mocked-unsw-logo');
    });
  });

  it('Edge case : renders default logo for unknown institution', async () => {
    const mockData = [
      {
        institution: {
          _id: 'inst1',
          name: 'Unknown University',
          rank: 1,
          address: '123 Unknown St'
        },
        courses: [
          {
            _id: 'course1',
            name: 'Unknown Course',
            rank: 1,
            duration: '3 years',
            international_fee: 50000,
            domestic_fee: 30000
          }
        ]
      }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    await waitFor(() => {
      const logo = screen.getByAltText('Unknown University logo');
      expect(logo).toHaveAttribute('src', 'mocked-usyd-logo');
    });
  });

  it('Abnormal case : renders "Loading..." when no student is selected', () => {
    store = mockStore({ selectedChild: { child: null } });

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('Normal case : renders loading state', () => {
    // Mock fetch to never resolve, keeping component in loading state
    global.fetch = jest.fn(() => new Promise(() => {}));

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('Edge case :renders error state', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Fetch error'));

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    // Wait for error state to be rendered
    const errorElement = await screen.findByText(/Error:/);
    expect(errorElement).toBeInTheDocument();
  });

  it('Normal case : renders loading state and then transitions to loaded state', async () => {
    // Create a store with a selected child
    const store = mockStore({
      selectedChild: {
        child: { _id: '123', name: 'Test Child' }
      }
    });

    // Mock the fetch to return a resolved promise after a short delay
    fetch.mockImplementation(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve([{
            institution: { name: 'Test University', rank: 1, address: 'Test Address' },
            courses: [{ name: 'Test Course', rank: 1, domestic_fee: 1000, international_fee: 2000 }]
          }])
        });
      }, 100);
    }));

    render(
      <Provider store={store}>
        <StudentsInstitutions />
      </Provider>
    );

    // Check if the loading message is initially rendered
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the loading state to resolve
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});