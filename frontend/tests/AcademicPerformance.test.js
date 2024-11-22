import React from 'react';
import { render, screen } from '@testing-library/react';
import AcademicPerformance from '../src/components/AcademicPerformance';
import '@testing-library/jest-dom';

// Mock the recharts library
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('AcademicPerformance Component', () => {
  const mockData = {
    Math: 85,
    English: 78,
  };

  test('renders without crashing', () => {
    render(<AcademicPerformance data={mockData} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  test('displays list of subjects and marks', () => {
    render(<AcademicPerformance data={mockData} />);
    expect(screen.getByText('Math: 85')).toBeInTheDocument();
    expect(screen.getByText('English: 78')).toBeInTheDocument();
  });

  test('handles empty data gracefully', () => {
    render(<AcademicPerformance data={{}} />);
    expect(screen.getByText('No academic performance data available.')).toBeInTheDocument();
  });
});