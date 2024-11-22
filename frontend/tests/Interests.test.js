import React from 'react';
import { render, screen } from '@testing-library/react';
import Interests from '../src/components/Interests';
import '@testing-library/jest-dom';

describe('Interests Component', () => {
  const mockData = [
    { name: 'Reading' },
    { name: 'Swimming' },
    { name: 'Coding' },
    { name: 'Gaming' }
  ];

  test('renders without crashing', () => {
    render(<Interests data={mockData} />);
  });

  test('displays list of interests', () => {
    render(<Interests data={mockData} />);
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getByText('Swimming')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();
  });

  test('handles empty data gracefully', () => {
    render(<Interests data={[]} />);
    expect(screen.getByText('No interests data available')).toBeInTheDocument();
  });

  test('handles insufficient data gracefully', () => {
    const insufficientData = [
      { name: 'Reading' },
      { name: 'Swimming' }
    ];
    render(<Interests data={insufficientData} />);
    expect(screen.getByText('No interests data available')).toBeInTheDocument();
  });
});
