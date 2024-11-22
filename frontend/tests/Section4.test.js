import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Section4 from '../src/components/Section4';

//Normal
//This test verifies that the component correctly renders the chart and student scores with valid data, which is a standard case.
test('renders chart correctly with valid data', () => {
  const mockData = [{ 'No.': 1, Q1: 8, Q2: 9, Q3: 10, Total: 27 }];
  render(<Section4 data={mockData} />);

  // Check if chart is in the document
  const chartWrapper = screen.getByRole('img');
  expect(chartWrapper).toBeInTheDocument();
});

//Boundary
test('renders loading state when data is empty', () => {
  render(<Section4 data={[]} />);
  const loadingElement = screen.getByText(/loading.../i);
  expect(loadingElement).toBeInTheDocument();
});

//Abnormal
test('handles non-array data input gracefully', () => {
  const invalidData = null; // or an invalid data type, like a string

  render(<Section4 data={invalidData} />);

  const fallbackElement = screen.getByText("Loading...");
  expect(fallbackElement).toBeInTheDocument();
});
 