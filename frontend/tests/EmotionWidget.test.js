import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmotionWidget from '../src/EmotionWidget';

// Mock the react-chartjs-2 module
jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="mock-doughnut-chart" />
}));

// Mock the fetch function
global.fetch = jest.fn();

describe('EmotionWidget', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the widget title', () => {
    render(<EmotionWidget />);
    expect(screen.getByText('Recent Emotion')).toBeInTheDocument();
  });

  it('displays the date range', () => {
    const mockDate = new Date('2024-10-20');
    jest.setSystemTime(mockDate);

    render(<EmotionWidget />);
    expect(screen.getByText('From Oct 7, 2024 to Oct 20, 2024')).toBeInTheDocument();
  });

  it('renders the doughnut chart', () => {
    render(<EmotionWidget />);
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
  });

  it('displays emotion percentages', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ emotionData: [40, 30, 20, 10] }),
    });

    render(<EmotionWidget />);

    await waitFor(() => {
      expect(screen.getByText('Happy:')).toBeInTheDocument();
      expect(screen.getByText('40%')).toBeInTheDocument();
      expect(screen.getByText('Anger:')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
      expect(screen.getByText('Sadness:')).toBeInTheDocument();
      expect(screen.getByText('20%')).toBeInTheDocument();
      expect(screen.getByText('neutral')).toBeInTheDocument();
      expect(screen.getByText('10%')).toBeInTheDocument();
    });
  });

  it('displays default emotion percentages when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<EmotionWidget />);

    await waitFor(() => {
      expect(screen.getByText('Happy:')).toBeInTheDocument();
      expect(screen.getByText('42%')).toBeInTheDocument();
      expect(screen.getByText('Anger:')).toBeInTheDocument();
      expect(screen.getByText('36%')).toBeInTheDocument();
      expect(screen.getByText('Sadness:')).toBeInTheDocument();
      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('neutral')).toBeInTheDocument();
      expect(screen.getByText('7%')).toBeInTheDocument();
    });
  });
});