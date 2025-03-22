import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Student } from '../types';

interface SupportOverviewGraphProps {
  students: Student[];
}

export const SupportOverviewGraph: React.FC<SupportOverviewGraphProps> = ({ students }) => {
  const supportData = [
    {
      category: 'Parent Involvement',
      average: students.reduce((sum, student) => sum + student.parent_involvement, 0) / students.length,
    },
    {
      category: 'Mental Health',
      average: students.reduce((sum, student) => sum + student.mental_health_score, 0) / students.length,
    },
    {
      category: 'Peer Relations',
      average: students.reduce((sum, student) => sum + student.peer_relationships_score, 0) / students.length,
    },
    {
      category: 'Activities',
      average: students.reduce((sum, student) => sum + student.extracurricular_activities, 0) / students.length,
    },
  ];

  return (
    <div className="h-40 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={supportData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Average Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};