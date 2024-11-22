import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import CareerInfoWindow from '../src/career/CareerInfoWindow';

jest.mock('axios');

// Mock ResizeObserver
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

const mockCareerData = {
    field: 'Software Engineering',
    icon_data: 'base64encodedstring',
    description: 'Software engineering is the process of designing, developing, and maintaining software systems.',
    careerPaths: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
    salaryRange: [
        { role: 'Junior Developer', lowest: 50000, highest: 80000 },
        { role: 'Senior Developer', lowest: 80000, highest: 150000 },
    ],
    recommendedCourses: [
        { degree: 'Bachelor of Science', major: 'Computer Science', institution: 'Tech University' },
    ],
    alumniTestimonial: {
        name: 'John Doe',
        title: 'Senior Software Engineer',
        quote: 'This career has been very rewarding.',
        image_data: 'base64encodedstring',
    },
    upcomingEvents: [
        { title: 'Tech Conference 2023', link: 'https://techconf2023.com' },
    ],
};

describe('CareerInfoWindow Component', () => {
    beforeEach(() => {
        axios.get.mockReset();
    });

    it('renders loading state initially', () => {
        render(<CareerInfoWindow field="Software Engineering" onClose={() => {}} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders career information when data is fetched successfully', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });

        render(<CareerInfoWindow field="Software Engineering" onClose={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText('Software Engineering')).toBeInTheDocument();
            expect(screen.getByText(/Software engineering is the process/)).toBeInTheDocument();
            expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Tech Conference 2023')).toBeInTheDocument();
        });
    });

    it('renders error message when data fetching fails', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        render(<CareerInfoWindow field="Software Engineering" onClose={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch career information/)).toBeInTheDocument();
        });
    });

    it('calls onClose when close button is clicked', async () => {
        const mockOnClose = jest.fn();
        axios.get.mockResolvedValue({ data: mockCareerData });

        render(<CareerInfoWindow field="Software Engineering" onClose={mockOnClose} />);

        await waitFor(() => {
            const closeButton = screen.getByRole('button', { name: /close/i });
            fireEvent.click(closeButton);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    it('renders salary range chart', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });

        render(<CareerInfoWindow field="Software Engineering" onClose={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText('Salary Range:')).toBeInTheDocument();
            expect(screen.getByTestId('salary-range-chart')).toBeInTheDocument();
        });
    });

    it('renders recommended courses', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });

        render(<CareerInfoWindow field="Software Engineering" onClose={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText('Related Courses:')).toBeInTheDocument();
            expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
            expect(screen.getByText('Major: Computer Science')).toBeInTheDocument();
            expect(screen.getByText('Offered: Tech University')).toBeInTheDocument();
        });
    });

    it('renders alumni testimonial', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });

        render(<CareerInfoWindow field="Software Engineering" onClose={() => {}} />);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
            expect(screen.getByText('"This career has been very rewarding."')).toBeInTheDocument();
        });
    });

    it('renders upcoming events with clickable links', async () => {
        axios.get.mockResolvedValue({ data: mockCareerData });

        render(<CareerInfoWindow field="Software Engineering" onClose={() => {}} />);

        await waitFor(() => {
            const eventLink = screen.getByText('Tech Conference 2023');
            expect(eventLink).toBeInTheDocument();
            expect(eventLink.closest('a')).toHaveAttribute('href', 'https://techconf2023.com');
        });
    });
});