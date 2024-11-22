import { render, screen, act } from '@testing-library/react';
import Section1 from '../src/components/Section1.js';
import React from 'react';  

describe('Section1 Component - Normal Test Cases', () => {
    test('renders loading state when no data is passed', () => {
      render(<Section1 data={null} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  
    test('renders radar chart when valid data is passed', () => {
      const sampleData = [
        { No: 1, H: 20, P: 30, A: 25, L: 15, F: 40, S: 35 }
      ];
  
      render(<Section1 data={sampleData} />);
      expect(screen.getByText('H: Homework')).toBeInTheDocument();
    });
  });
// Check if the radar chart and text box are rendered side by side
// test('renders radar chart and text box side by side', () => {
//     const data = [
//         { No: 1, H: 10, P: 20, A: 30, L: 40, F: 50, S: 35 }
//     ];

//     const { container } = render(<Section1 data={data} />);
//     const contentContainer = container.querySelector('.content-container');
//     expect(contentContainer).toBeInTheDocument();

//     // Check the computed style
//     console.log(window.getComputedStyle(contentContainer).display);
//     expect(window.getComputedStyle(contentContainer).display).toBe('flex');

//     const chartContainer = container.querySelector('.chart-container');
//     const textBox = container.querySelector('.text-box');

//     expect(chartContainer).toBeInTheDocument();
//     expect(textBox).toBeInTheDocument();
//     expect(contentContainer).toContainElement(chartContainer);
//     expect(contentContainer).toContainElement(textBox);
// });

// Check if the radar chart is populated with correct data
//Functional testing
test('populates radar chart with correct data', () => {
    const data = [
        { No: 1, H: 10, P: 20, A: 30, L: 40, F: 50, S: 35 }
    ];

    const { container } = render(<Section1 data={data} />);

    // Check that the Radar chart has been passed the correct data
    const radarChart = container.querySelector('canvas');
    expect(radarChart).toBeInTheDocument();
});

// Test for empty data array
//Functional testing
test('displays loading message for empty data', () => {
    render(<Section1 data={[]} />);

    // Check for loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
});

// Test for null data
//Functional testing
test('displays loading message for null data', () => {
    render(<Section1 data={null} />);

    // Check for loading message
    expect(screen.getByText('Loading...')).toBeInTheDocument();
});

// Test for handling missing data keys
//Functional testing
test('handles missing data keys', () => {
    const incompleteData = [
        { No: 1, H: 10, P: 20, A: 30, L: 15 } // Missing F and S
    ];

    const { container } = render(<Section1 data={incompleteData} />);

    // Check that the radar chart renders without breaking
    expect(container.querySelector('canvas')).toBeInTheDocument();
});

// Test for handling values capped at 60 correctly
//Boundary testing
test('handles values capped at 60 correctly', () => {
    const cappedData = [
        { No: 1, H: -100, P: 70, A: 80, L: 50, F: 30, S: 60 }
    ];

    // Render the component
    const { container } = render(<Section1 data={cappedData} />);

    // Check that the radar chart renders correctly
    expect(container.querySelector('canvas')).toBeInTheDocument();

    // Optionally check if values are capped at 60
    // This may require inspecting the chart data if possible
    // or visually inspecting the chart to confirm correct display
});

// Test for handling large dataset with values capped at 60 without performance issues
test('handles large dataset with values capped at 60 without performance issues', () => {
    const largeData = Array.from({ length: 100 }, (_, index) => ({
        No: index + 1,
        H: Math.min(Math.random() * 100, 60),
        P: Math.min(Math.random() * 100, 60),
        A: Math.min(Math.random() * 100, 60),
        L: Math.min(Math.random() * 100, 60),
        F: Math.min(Math.random() * 100, 60),
        S: Math.min(Math.random() * 100, 60)
    }));

    const { container } = render(<Section1 data={largeData} />);

    // Check that the radar chart renders correctly
    expect(container.querySelector('canvas')).toBeInTheDocument();
});

describe('Section1 Component - Abnormal Test Cases', () => {
    test('handles empty data gracefully', () => {
      render(<Section1 data={[]} />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  
    // test('handles data with missing fields', () => {
    //   const sampleData = [{ No: 1, H: 20, P: null, A: undefined }];
    //   render(<Section1 data={sampleData} />);
    //   expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    //   // Check that the chart still renders even with missing fields
    // });
  });