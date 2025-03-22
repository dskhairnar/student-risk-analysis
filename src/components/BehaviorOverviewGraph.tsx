import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Student } from '../types';

interface BehaviorOverviewGraphProps {
  students: Student[];
}

export const BehaviorOverviewGraph: React.FC<BehaviorOverviewGraphProps> = ({ students }) => {
  const incidentsByQuarter = [
    {
      quarter: 'Q1',
      incidents: students.reduce((sum, student) => sum + student.q1_behavior_incidents, 0),
    },
    {
      quarter: 'Q2',
      incidents: students.reduce((sum, student) => sum + student.q2_behavior_incidents, 0),
    },
    {
      quarter: 'Q3',
      incidents: students.reduce((sum, student) => sum + student.q3_behavior_incidents, 0),
    },
    {
      quarter: 'Q4',
      incidents: students.reduce((sum, student) => sum + student.q4_behavior_incidents, 0),
    },
  ];

  return (
    <div className="h-40 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={incidentsByQuarter}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar 
            dataKey="incidents" 
            fill="#8b5cf6" 
            name="Total Incidents"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};