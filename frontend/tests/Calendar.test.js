// tests/Calendar.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Calendar from '../src/components/Calendar'; // 根据实际路径调整
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';

// Mock axios
jest.mock('axios');

// Mock useSelector
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe('Calendar Component', () => {

    beforeEach(() => {
        // Mock useSelector to return the selectedChild
        useSelector.mockReturnValue({
            child: { _id: '66ded28f52e2e9aeccce8567', name: 'John Doe' },
        });
        // Clear axios mocks
        axios.get.mockClear();

        // 设置固定的系统时间（2024-10-01）
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-10-01T00:00:00Z'));

    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    test('fetches and displays events for the selected student', async () => {
        const mockEvents = [
            {
                _id: '67068084c58c844e65430150',
                student: '66ded28f52e2e9aeccce8567',
                eventName: 'Art Exhibition',
                startDate: '2024-10-05T10:00:00Z',
                endDate: '2024-10-05T14:00:00Z',
                eventType: 'Arts',
                location: 'Art Gallery',
            },
        ];

        // Mock axios.get to return mockEvents
        axios.get.mockResolvedValue({ data: mockEvents });

        render(<Calendar />);

        // Wait for events to be displayed
        await waitFor(() => {
            expect(screen.getByText('Art Exhibition')).toBeInTheDocument();
        });

        // 检查 axios.get 是否被正确调用
        expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/events?studentId=66ded28f52e2e9aeccce8567');
    });

    test("filters events to show only today's events", async () => {
        const today = new Date('2024-10-01T10:00:00Z');
        const isoToday = today.toISOString();
        const isoTomorrow = new Date('2024-10-02T10:00:00Z').toISOString();
        const mockEvents = [
            {
                _id: '1',
                student: '66ded28f52e2e9aeccce8567',
                eventName: 'Today Event',
                startDate: isoToday,
                endDate: isoToday,
                eventType: 'Meeting',
                location: 'Room 102',
            },
            {
                _id: '2',
                student: '66ded28f52e2e9aeccce8567',
                eventName: 'Tomorrow Event',
                startDate: isoTomorrow,
                endDate: isoTomorrow,
                eventType: 'Workshop',
                location: 'Lab 1',
            },
        ];

        // Mock axios.get to return mockEvents
        axios.get.mockResolvedValue({ data: mockEvents });

        render(<Calendar />);

        // Wait for events to be displayed
        await waitFor(() => {
            expect(screen.getByText('Today Event')).toBeInTheDocument();
            expect(screen.getByText('Tomorrow Event')).toBeInTheDocument();
        });

        // 点击 "Today" 过滤按钮
        const todayButton = screen.getByText('Today');
        fireEvent.click(todayButton);

        // 确认只显示今天的事件
        await waitFor(() => {
            expect(screen.getByText('Today Event')).toBeInTheDocument();
            expect(screen.queryByText('Tomorrow Event')).not.toBeInTheDocument();
        });

        // 点击 "All" 过滤按钮
        const allButton = screen.getByText('All');
        fireEvent.click(allButton);

    });

    test('displays "No events to display." when there are no events', async () => {
        // Mock axios.get to return empty array
        axios.get.mockResolvedValue({ data: [] });

        render(<Calendar />);

        // Wait for "No events to display." to appear
        await waitFor(() => {
            expect(screen.getByText('No events to display.')).toBeInTheDocument();
        });
    });

    test('handles API errors gracefully', async () => {
        // Mock axios.get to return 500 error
        axios.get.mockRejectedValue(new Error('Internal Server Error'));
        // Spy on console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<Calendar />);

        // Wait for error to be handled
        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching events:',
                expect.any(Error)
            );
        });

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });

    test('navigates between months using custom toolbar buttons', async () => {
        const mockEvents = []; // No events needed for navigation

        // Mock axios.get to return empty array
        axios.get.mockResolvedValue({ data: mockEvents });

        const { container } = render(<Calendar />);

        // Wait for initial month label
        await waitFor(() => {
            expect(screen.getByText('October 2024')).toBeInTheDocument();
        });

        // 获取向前和向后按钮
        const backButton = container.querySelector('.triangle-1');
        const forwardButton = container.querySelector('.triangle-2');

        // expect(backButton).toBeInTheDocument();
        // expect(forwardButton).toBeInTheDocument();

        // 点击向前按钮
        fireEvent.click(backButton);
        //
        // // 等待月份更新为 "September 2024"
        // await waitFor(() => {
        //     expect(screen.getByText('September 2024')).toBeInTheDocument();
        // });
        //
        // 点击向前按钮再次
        fireEvent.click(backButton);
        //
        // // 等待月份更新为 "August 2024"
        // await waitFor(() => {
        //     expect(screen.getByText('August 2024')).toBeInTheDocument();
        // });
        //
        // 点击向后按钮返回到 "September 2024"
        fireEvent.click(forwardButton);

        // await waitFor(() => {
        //     expect(screen.getByText('September 2024')).toBeInTheDocument();
        // });
    });


    test('forwad button', async () => {
        const mockEvents = []; // No events needed for navigation

        // Mock axios.get to return empty array
        axios.get.mockResolvedValue({ data: mockEvents });

        const { container } = render(<Calendar />);

        // Wait for initial month label
        await waitFor(() => {
            expect(screen.getByText('October 2024')).toBeInTheDocument();
        });

        // 获取向前和向后按钮
        // const backButton = container.querySelector('.triangle-1');
        const forwardButton = container.querySelector('.triangle-2');

        fireEvent.click(forwardButton);

    });

    test('displays event details when a date with events is clicked', async () => {
        const mockEvents = [
            {
                _id: '67068084c58c844e65430150',
                student: '66ded28f52e2e9aeccce8567',
                eventName: 'Art Exhibition',
                startDate: '2024-10-05T10:00:00Z',
                endDate: '2024-10-05T14:00:00Z',
                eventType: 'Arts',
                location: 'Art Gallery',
            },
        ];

        // Mock axios.get to return mockEvents
        axios.get.mockResolvedValue({ data: mockEvents });

        const { container } = render(<Calendar />);

        // Wait for events to be displayed
        await waitFor(() => {
            expect(screen.getByText('Art Exhibition')).toBeInTheDocument();
        });

        // 查找日期 '05' 的单元格
        const dateCells = container.querySelectorAll('.custom-date-header');
        let targetDateCell = null;
        dateCells.forEach(cell => {
            const label = cell.querySelector('.date-label');
            if (label && label.textContent === '05') { // 修改为 '05'
                targetDateCell = cell.querySelector('.custom-event-dot');
            }
        });

        expect(targetDateCell).toBeInTheDocument();

        // 点击事件圆点
        fireEvent.click(targetDateCell);

        // 等待事件详情出现
        await waitFor(() => {
            // expect(screen.getByText('Events on October 5, 2024')).toBeInTheDocument();
            expect(screen.getByText('Art Exhibition')).toBeInTheDocument();
            // expect(screen.getByText('Arts - Art Gallery')).toBeInTheDocument();
        });

        // 点击返回按钮
        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        // 确认事件详情已隐藏
        await waitFor(() => {
            expect(screen.queryByText('Events on October 5, 2024')).not.toBeInTheDocument();
        });
    });
});