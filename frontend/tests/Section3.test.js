import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Section3 from '../src/components/Section3';

// Mock the framer-motion module
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock the react-chartjs-2 module
jest.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="mock-bar-chart" />,
}));

describe('Section3 Component', () => {
  const mockData = [
    { 'No.': 1, 'E': 60, 'I': 40, 'S': 55, 'N': 45, 'T': 70, 'F': 30, 'J': 65, 'P': 35 },
    { 'No.': 2, 'E': 45, 'I': 55, 'S': 40, 'N': 60, 'T': 35, 'F': 65, 'J': 30, 'P': 70 },
  ];

  it('renders loading state when no data is provided', () => {
    render(<Section3 />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders loading state when empty data array is provided', () => {
    render(<Section3 data={[]} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the component with data', () => {
    render(<Section3 data={mockData} />);
    expect(screen.getByText('Personality Types')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-bar-chart')).toHaveLength(2);
  });

  it('calculates and displays correct MBTI results', () => {
    render(<Section3 data={mockData} />);
    expect(screen.getByText('ESTJ')).toBeInTheDocument();
    expect(screen.getByText('INFP')).toBeInTheDocument();
  });

  it('applies framer-motion animation props', () => {
    render(<Section3 data={mockData} />);
    const motionDiv = screen.getByText('Personality Types').closest('div');
    expect(motionDiv).toHaveAttribute('initial');
    expect(motionDiv).toHaveAttribute('animate');
    expect(motionDiv).toHaveAttribute('transition');
  });

  it('renders correct number of charts', () => {
    render(<Section3 data={mockData} />);
    const charts = screen.getAllByTestId('mock-bar-chart');
    expect(charts).toHaveLength(mockData.length);
  });

  it('displays MBTI Result subtitle', () => {
    render(<Section3 data={mockData} />);
    const subtitles = screen.getAllByText('MBTI Result:');
    expect(subtitles).toHaveLength(mockData.length);
  });
});