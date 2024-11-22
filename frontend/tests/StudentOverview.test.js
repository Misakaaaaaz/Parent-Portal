import React from 'react';
import { render, screen } from '@testing-library/react';
import StudentOverview from '../src/components/StudentOverview';
import '@testing-library/jest-dom';

describe('StudentOverview Component', () => {
  const mockData = {
    name: 'John Doe',
    age: 16,
    schoolName: 'High School',
    class: '10A',
    grade: 'A',
    imageURL: 'http://example.com/avatar.jpg',
  };

  test('renders without crashing', () => {
    render(<StudentOverview data={mockData} />);
  });

  test('displays student information correctly', () => {
    render(<StudentOverview data={mockData} />);
    expect(screen.getByText('Student Overview')).toBeInTheDocument();
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
    expect(screen.getByText('School:')).toBeInTheDocument();
    expect(screen.getByText('High School')).toBeInTheDocument();
    expect(screen.getByText('Class:')).toBeInTheDocument();
    expect(screen.getByText('10A')).toBeInTheDocument();
    expect(screen.getByText('Grade:')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  test('handles missing data gracefully', () => {
    const incompleteData = { name: 'John Doe' };
    render(<StudentOverview data={incompleteData} />);
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('School:')).toBeInTheDocument();
    expect(screen.getByText('Class:')).toBeInTheDocument();
    expect(screen.getByText('Grade:')).toBeInTheDocument();
  });

  test('displays student avatar with correct alt text', () => {
    render(<StudentOverview data={mockData} />);
    const avatar = screen.getByAltText("John Doe's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'http://example.com/avatar.jpg');
  });

  test('handles null values gracefully', () => {
    const dataWithNulls = { ...mockData, age: null, grade: null };
    render(<StudentOverview data={dataWithNulls} />);
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('Grade:')).toBeInTheDocument();
    expect(screen.queryByText('null')).not.toBeInTheDocument();
  });
});