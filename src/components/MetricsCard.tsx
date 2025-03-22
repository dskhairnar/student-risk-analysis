import React from 'react';
import { Student } from '../types';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  metrics: {
    label: string;
    value: string | number;
    color?: string;
  }[];
  bgColor: string;
  iconColor: string;
  graph?: React.ReactNode;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  icon: Icon,
  title,
  description,
  metrics,
  bgColor,
  iconColor,
  graph,
}) => {
  return (
    <div className={`${bgColor} rounded-lg shadow p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="space-y-2">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{metric.label}</span>
            <span className={`font-medium ${metric.color || 'text-gray-900'}`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
      {graph && (
        <div className="mt-4">
          {graph}
        </div>
      )}
    </div>
  );
};