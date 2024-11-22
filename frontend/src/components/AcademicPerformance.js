import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default class AcademicPerformance extends PureComponent {
  render() {
    const { data } = this.props;

    // Check if data is empty or undefined
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="subjects">
          <div className="title-1">Academic Performance</div>
          <p>No academic performance data available.</p>
        </div>
      );
    }

    // Process the data object to create an array suitable for Recharts
    const processedData = Object.entries(data).map(([subject, mark]) => ({
      subject,
      mark,
    }));

    return (
      <div className="subjects">
        <div className="title-1">Academic Performance</div>
        <ul>
          {processedData.map(({ subject, mark }) => (
            <li key={subject}>
              {subject}: {mark}
            </li>
          ))}
        </ul>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={processedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="mark"
              fill="#8884d8"
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}