import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Section2 from '../src/components/Section2';

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

describe('Section2 Component', () => {
  const mockData = [
    { 'No.': 1, 'A': 10, 'S': 20, 'I': 30, 'C': 40, 'E': 50, 'R': 60 },
    { 'No.': 2, 'A': 15, 'S': 25, 'I': 35, 'C': 45, 'E': 55, 'R': 65 },
  ];

  it('renders loading state when no data is provided', () => {
    render(<Section2 />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders loading state when empty data array is provided', () => {
    render(<Section2 data={[]} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the component with data', () => {
    render(<Section2 data={mockData} />);
    expect(screen.getByText('Career Orientation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
  });

  it('renders the legend text box', () => {
    render(<Section2 data={mockData} />);
    const legendItems = ['A: Artistic', 'S: Social', 'I: Investigative', 'C: Conventional', 'E: Enterprising', 'R: Realistic'];
    legendItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('applies framer-motion animation props', () => {
    render(<Section2 data={mockData} />);
    const motionDiv = screen.getByText('Career Orientation').closest('div');
    expect(motionDiv).toHaveAttribute('initial');
    expect(motionDiv).toHaveAttribute('animate');
    expect(motionDiv).toHaveAttribute('transition');

    expect(motionDiv.getAttribute('initial')).toBe('[object Object]');
    expect(motionDiv.getAttribute('animate')).toBe('[object Object]');
    expect(motionDiv.getAttribute('transition')).toBe('[object Object]');

    // Check if the class name is applied correctly
    expect(motionDiv).toHaveClass('rectangle-5');
  });
});