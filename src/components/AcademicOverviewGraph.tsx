import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Student } from '../types';

interface AcademicOverviewGraphProps {
  students: Student[];
}

export const AcademicOverviewGraph: React.FC<AcademicOverviewGraphProps> = ({ students }) => {
  const averagesByQuarter = [
    {
      quarter: 'Q1',
      average: students.reduce((sum, student) => sum + student.q1_percentage, 0) / students.length,
    },
    {
      quarter: 'Q2',
      average: students.reduce((sum, student) => sum + student.q2_percentage, 0) / students.length,
    },
    {
      quarter: 'Q3',
      average: students.reduce((sum, student) => sum + student.q3_percentage, 0) / students.length,
    },
    {
      quarter: 'Q4',
      average: students.reduce((sum, student) => sum + student.q4_percentage, 0) / students.length,
    },
  ];

  return (
    <div className="h-40 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={averagesByQuarter}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="average" 
            stroke="#3b82f6" 
            fill="#93c5fd" 
            name="Average Performance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};