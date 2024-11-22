import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchStudentData, fetchStudentDataById, fetchRecentEmotion } from '../src/services/studentData';

// This sets the mock adapter on the default instance
const mock = new MockAdapter(axios);

describe('studentData', () => {
    afterEach(() => {
        // Reset mock after each test
        mock.reset();
    });

    describe('fetchStudentData', () => {
        it('Normal case: fetches student data successfully', async () => {
            const mockData = { name: 'John Doe', age: 20 };
            mock.onGet('http://localhost:5000/api/student-data?linkingCode=123456').reply(200, mockData);

            const result = await fetchStudentData('123456');
            expect(result).toEqual(mockData);
        });

        it('Abnormal case: handles error when fetching student data', async () => {
            mock.onGet('http://localhost:5000/api/student-data?linkingCode=123456').reply(500);

            await expect(fetchStudentData('123456')).rejects.toThrow();
        });

        it('Edge case: handles empty response', async () => {
            mock.onGet('http://localhost:5000/api/student-data?linkingCode=123456').reply(200, {});

            const result = await fetchStudentData('123456');
            expect(result).toEqual({});
        });
    });

    describe('fetchStudentDataById', () => {
        it('Normal case: fetches student data by ID successfully', async () => {
            const mockData = { id: '123', name: 'Jane Doe', age: 22 };
            mock.onGet('http://localhost:5000/api/student-data/123').reply(200, mockData);

            const result = await fetchStudentDataById('123');
            expect(result).toEqual(mockData);
        });

        it('Abnormal case: handles error when fetching student data by ID', async () => {
            mock.onGet('http://localhost:5000/api/student-data/123').reply(500);

            await expect(fetchStudentDataById('123')).rejects.toThrow();
        });

        it('Edge case: handles non-existent student ID', async () => {
            mock.onGet('http://localhost:5000/api/student-data/999').reply(404);

            await expect(fetchStudentDataById('999')).rejects.toThrow();
        });
    });

    describe('fetchRecentEmotion', () => {
        it('Normal case: fetches recent emotion data successfully', async () => {
            const mockEmotionData = { happy: 0.8, sad: 0.2 };
            mock.onGet('http://localhost:5000/api/emotion/123456').reply(200, mockEmotionData);

            const result = await fetchRecentEmotion('123456');
            expect(result).toEqual(mockEmotionData);
        });

        it('Abnormal case: handles error when fetching recent emotion data', async () => {
            mock.onGet('http://localhost:5000/api/emotion/123456').reply(500);

            await expect(fetchRecentEmotion('123456')).rejects.toThrow();
        });

        it('Edge case: handles empty emotion data', async () => {
            mock.onGet('http://localhost:5000/api/emotion/123456').reply(200, {});

            const result = await fetchRecentEmotion('123456');
            expect(result).toEqual({});
        });
    });
});