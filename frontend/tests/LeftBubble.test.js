import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeftBubble from '../src/career/LeftBubble';

// Mock the react-chartjs-2 Bubble component
jest.mock('react-chartjs-2', () => ({
    Bubble: jest.fn(({ options }) => (
        <div
            data-testid="mock-bubble-chart"
            onClick={(e) => options.onClick(e, [{element: {$context: {raw: {field: 'Engineering'}}}}])}
            onMouseOver={(e) => options.onHover(e, [{element: {options: {field: 'Engineering'}}}])}
            onMouseOut={(e) => options.onHover(e, [])}
        />
    ))
}));

describe('LeftBubble Component', () => {
    const mockData = [
        { field: 'Engineering', rank: 1 },
        { field: 'Medicine', rank: 2 },
        { field: 'Computer Science', rank: 3 }
    ];

    let mockOnBubbleClick;

    beforeEach(() => {
        mockOnBubbleClick = jest.fn();
        jest.clearAllMocks();
    });

    it('renders loading state when no data is provided', () => {
        render(<LeftBubble />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders the Bubble chart when data is provided', () => {
        render(<LeftBubble data={mockData} onBubbleClick={mockOnBubbleClick} />);
        expect(screen.getByTestId('mock-bubble-chart')).toBeInTheDocument();
    });

    it('applies correct color based on isLeft prop', () => {
        const { rerender } = render(<LeftBubble data={mockData} isLeft={true} onBubbleClick={mockOnBubbleClick} />);
        let bubbleProps = require('react-chartjs-2').Bubble.mock.calls[0][0];
        expect(bubbleProps.data.datasets[0].backgroundColor).toBe('rgba(75, 192, 192, 0.6)');

        rerender(<LeftBubble data={mockData} isLeft={false} onBubbleClick={mockOnBubbleClick} />);
        bubbleProps = require('react-chartjs-2').Bubble.mock.calls[1][0];
        expect(bubbleProps.data.datasets[0].backgroundColor).toBe('rgba(255, 99, 132, 0.6)');
    });

    it('calls onBubbleClick when a bubble is clicked', async () => {
        render(<LeftBubble data={mockData} onBubbleClick={mockOnBubbleClick} />);
        const bubbleChart = screen.getByTestId('mock-bubble-chart');

        fireEvent.click(bubbleChart);

        await waitFor(() => {
            expect(mockOnBubbleClick).toHaveBeenCalledWith(expect.objectContaining({ field: 'Engineering' }));
        });
    });

    it('shows and hides hover info when a bubble is hovered', async () => {
        render(<LeftBubble data={mockData} onBubbleClick={mockOnBubbleClick} />);
        const bubbleChart = screen.getByTestId('mock-bubble-chart');

        fireEvent.mouseOver(bubbleChart);

        await waitFor(() => {
            const hoverContainer = screen.getByTestId('bubble-hover-info');
            expect(hoverContainer).toBeInTheDocument();
        });

        fireEvent.mouseOut(bubbleChart);

        await waitFor(() => {
            const hoverContainer = screen.queryByTestId('bubble-hover-info');
            expect(hoverContainer).not.toBeInTheDocument();
        });
    });

    it('calculates correct bubble sizes based on rank', () => {
        render(<LeftBubble data={mockData} onBubbleClick={mockOnBubbleClick} />);
        const bubbleProps = require('react-chartjs-2').Bubble.mock.calls[0][0];
        const bubbleData = bubbleProps.data.datasets[0].data;

        expect(bubbleData[0].r).toBeGreaterThan(bubbleData[1].r);
        expect(bubbleData[1].r).toBeGreaterThan(bubbleData[2].r);
    });

    it('handles empty data array', () => {
        render(<LeftBubble data={[]} onBubbleClick={mockOnBubbleClick} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});