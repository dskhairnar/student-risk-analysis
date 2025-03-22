import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StudentPerformanceGraphProps {
  data: {
    q1_percentage: number;
    q2_percentage: number;
    q3_percentage: number;
    q4_percentage: number;
    q1_attendance: number;
    q2_attendance: number;
    q3_attendance: number;
    q4_attendance: number;
  };
}

export const StudentPerformanceGraph: React.FC<StudentPerformanceGraphProps> = ({ data }) => {
  const chartData = [
    { quarter: 'Q1', percentage: data.q1_percentage, attendance: data.q1_attendance },
    { quarter: 'Q2', percentage: data.q2_percentage, attendance: data.q2_attendance },
    { quarter: 'Q3', percentage: data.q3_percentage, attendance: data.q3_attendance },
    { quarter: 'Q4', percentage: data.q4_percentage, attendance: data.q4_attendance },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="percentage" 
            stroke="#3b82f6" 
            name="Academic Performance"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="attendance" 
            stroke="#10b981" 
            name="Attendance"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};