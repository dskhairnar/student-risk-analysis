import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface RiskIndicatorProps {
  level: 'Low' | 'Medium' | 'High';
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ level }) => {
  const getColor = () => {
    switch (level) {
      case 'Low':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'High':
        return 'text-red-500';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'Low':
        return <CheckCircle className="w-5 h-5" />;
      case 'Medium':
        return <AlertCircle className="w-5 h-5" />;
      case 'High':
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${getColor()}`}>
      {getIcon()}
      <span className="font-medium">{level}</span>
    </div>
  );
};