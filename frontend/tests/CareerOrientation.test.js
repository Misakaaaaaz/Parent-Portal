import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CareerOrientation from '../src/career/CareerOrientation';

// Mock child components
jest.mock('../src/career/LeftBubble', () => ({ data, isLeft, onBubbleClick }) => (
    <div data-testid="left-bubble">
        {data.map(item => (
            <button key={item.field} onClick={() => onBubbleClick(item)}>{item.field}</button>
        ))}
    </div>
));

jest.mock('../src/career/RightBubble', () => ({ data, isLeft, onBubbleClick }) => (
    <div data-testid="right-bubble">
        {data.map(item => (
            <button key={item.field} onClick={() => onBubbleClick(item)}>{item.field}</button>
        ))}
    </div>
));

jest.mock('../src/career/CareerInfoWindow', () => ({ field, onClose }) => (
    <div data-testid="career-info-window">
        <p>Info for {field}</p>
        <button onClick={onClose}>Close</button>
    </div>
));

jest.mock('axios');

const mockCareerData = {
    recommended: [
        { field: 'Software Engineering', rank: 1 },
        { field: 'Data Science', rank: 2 },
    ],
    notRecommended: [
        { field: 'Accounting', rank: 1 },
        { field: 'Marketing', rank: 2 },
    ],
};

describe('CareerOrientation Component', () => {
    beforeEach(() => {
        axios.get.mockReset();
    });

    it('renders the component title and description', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });
        render(<CareerOrientation />);

        expect(screen.getByText('Career Orientation')).toBeInTheDocument();
        expect(screen.getByText("Explore your child's current interests and how they've evolved over time.")).toBeInTheDocument();
    });

    it('fetches and displays career data', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });
        render(<CareerOrientation />);

        await waitFor(() => {
            expect(screen.getByText('Software Engineering')).toBeInTheDocument();
            expect(screen.getByText('Accounting')).toBeInTheDocument();
        });
    });

    it('displays recommended and not recommended sections', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });
        render(<CareerOrientation />);

        await waitFor(() => {
            expect(screen.getByText('Recommended ✅')).toBeInTheDocument();
            expect(screen.getByText('Not Recommended ⚠️')).toBeInTheDocument();
        });
    });

    it('opens CareerInfoWindow when a bubble is clicked', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });
        render(<CareerOrientation />);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Software Engineering'));
        });

        expect(screen.getByTestId('career-info-window')).toBeInTheDocument();
        expect(screen.getByText('Info for Software Engineering')).toBeInTheDocument();
    });

    it('closes CareerInfoWindow when close button is clicked', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });
        render(<CareerOrientation />);

        await waitFor(() => {
            fireEvent.click(screen.getByText('Software Engineering'));
        });

        expect(screen.getByTestId('career-info-window')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Close'));

        expect(screen.queryByTestId('career-info-window')).not.toBeInTheDocument();
    });

    it('handles error when fetching career data fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        axios.get.mockRejectedValue(new Error('Network error'));
        render(<CareerOrientation />);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching career data:', expect.any(Error));
        });

        consoleErrorSpy.mockRestore();
    });
});