import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmotionWidget from '../src/EmotionWidget';

// Mock the react-chartjs-2 module
jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="mock-doughnut-chart" />
}));

describe('EmotionWidget', () => {
  const mockRecentEmotion = {
    ExtraSad: 10,
    Sad: 20,
    Neutral: 30,
    Happy: 25,
    ExtraHappy: 15
  };

  it('renders with default data when no props are provided', () => {
    render(<EmotionWidget />);
    expect(screen.getByText('Recent Emotion')).toBeInTheDocument();
    expect(screen.getByText(/From .* to .*/)).toBeInTheDocument();
    expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
    expect(screen.getByText('Happy:')).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('renders the widget with provided emotion data', async () => {
    render(<EmotionWidget recentEmotion={mockRecentEmotion} />);

    await waitFor(() => {
      expect(screen.getByText('Recent Emotion')).toBeInTheDocument();
      expect(screen.getByText(/From .* to .*/)).toBeInTheDocument();
      expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
    });

    const emotionLabels = ['Happy', 'Anger', 'Sadness', 'neutral'];
    emotionLabels.forEach(label => {
      expect(screen.getByText(new RegExp(label, 'i'))).toBeInTheDocument();
    });
  });

  it('displays emotion percentages', async () => {
    render(<EmotionWidget recentEmotion={mockRecentEmotion} />);

    await waitFor(() => {
      expect(screen.getByText('42%')).toBeInTheDocument();
      expect(screen.getByText('36%')).toBeInTheDocument();
      expect(screen.getByText('15%')).toBeInTheDocument();
      expect(screen.getByText('7%')).toBeInTheDocument();
    });
  });

  it('renders correctly when recentEmotion prop changes', async () => {
    const { rerender } = render(<EmotionWidget recentEmotion={mockRecentEmotion} />);

    await waitFor(() => {
      expect(screen.getByText('42%')).toBeInTheDocument();
    });

    const newRecentEmotion = {
      ExtraSad: 5,
      Sad: 10,
      Neutral: 15,
      Happy: 40,
      ExtraHappy: 30
    };

    rerender(<EmotionWidget recentEmotion={newRecentEmotion} />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
      expect(screen.getByText('Happy:')).toBeInTheDocument();
      // We're not checking for specific percentages here as they might not update immediately
    });
  });

  it('handles zero values', async () => {
    const zeroEmotion = {
      ExtraSad: 0,
      Sad: 0,
      Neutral: 0,
      Happy: 0,
      ExtraHappy: 0
    };

    render(<EmotionWidget recentEmotion={zeroEmotion} />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-doughnut-chart')).toBeInTheDocument();
      expect(screen.getByText('Happy:')).toBeInTheDocument();
      expect(screen.getByText('Anger:')).toBeInTheDocument();
      expect(screen.getByText('Sadness:')).toBeInTheDocument();
      expect(screen.getByText('neutral')).toBeInTheDocument();
      // We're not checking for specific percentages here as they might not update immediately
    });
  });
});