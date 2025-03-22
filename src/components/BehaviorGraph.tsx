import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BehaviorGraphProps {
  data: {
    q1_behavior_incidents: number;
    q2_behavior_incidents: number;
    q3_behavior_incidents: number;
    q4_behavior_incidents: number;
  };
}

export const BehaviorGraph: React.FC<BehaviorGraphProps> = ({ data }) => {
  const chartData = [
    { quarter: 'Q1', incidents: data.q1_behavior_incidents },
    { quarter: 'Q2', incidents: data.q2_behavior_incidents },
    { quarter: 'Q3', incidents: data.q3_behavior_incidents },
    { quarter: 'Q4', incidents: data.q4_behavior_incidents },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="quarter" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="incidents" 
            fill="#8b5cf6" 
            name="Behavior Incidents"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};