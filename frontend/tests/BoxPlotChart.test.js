// BoxPlotChart.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import BoxPlotChart from '../src/components/BoxPlotChart';
import Plot from 'react-plotly.js';
import '@testing-library/jest-dom';

jest.mock('react-plotly.js', () => {
  return jest.fn(() => null);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('BoxPlotChart Component', () => {
  const mockData = [
    {
      name: 'Math',
      q1: 70,
      median: 80,
      q3: 90,
      min: 60,
      max: 100,
      mark: 85,
    },
    {
      name: 'English',
      q1: 65,
      median: 75,
      q3: 85,
      min: 55,
      max: 95,
      mark: 80,
    },
  ];

  test('renders without crashing', () => {
    render(<BoxPlotChart data={mockData} />);
  });

  test('renders Plot component with correct data', () => {
    render(<BoxPlotChart data={mockData} />);
    expect(Plot).toHaveBeenCalled();
    const plotProps = Plot.mock.calls[0][0];
    expect(plotProps.data.length).toBe(2); // Box trace and scatter trace
    expect(plotProps.data[0].x).toEqual(['Math', 'English']);
    expect(plotProps.data[1].y).toEqual([85, 80]);
  });

  test('handles empty data gracefully', () => {
    render(<BoxPlotChart data={[]} />);
    expect(Plot).toHaveBeenCalled();
    const plotProps = Plot.mock.calls[0][0];
    expect(plotProps.data[0].x).toEqual([]);
  });

  test('displays title correctly', () => {
    render(<BoxPlotChart data={mockData} />);
    expect(screen.getByText('Academic Performance')).toBeInTheDocument();
  });
});
