import React from 'react';
import { Student } from '../types';
import { RiskIndicator } from './RiskIndicator';
import { BookOpen, Brain, Users, X, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { StudentPerformanceGraph } from './StudentPerformanceGraph';
import { BehaviorGraph } from './BehaviorGraph';

interface StudentDetailsProps {
  student: Student;
  onClose: () => void;
}

export const StudentDetails: React.FC<StudentDetailsProps> = ({ student, onClose }) => {
  const academicTrend = student.percentage - student.previous_year_percentage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-gray-600">Grade {student.grade}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-blue-900">Academic Performance</h3>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Current Percentage</span>
                  <span className="font-semibold">{student.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Performance Trend</span>
                  <div className="flex items-center gap-1">
                    {academicTrend > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={academicTrend > 0 ? "text-green-500" : "text-red-500"}>
                      {Math.abs(academicTrend).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Math Score</span>
                  <span className="font-semibold">{student.math_percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">English Score</span>
                  <span className="font-semibold">{student.english_percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Science Score</span>
                  <span className="font-semibold">{student.science_percentage.toFixed(1)}%</span>
                </div>
              </div>
              <StudentPerformanceGraph data={student} />
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-6 h-6 text-purple-500" />
                <h3 className="text-lg font-semibold text-purple-900">Behavioral Analysis</h3>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-800">Behavior Incidents</span>
                  <span className="font-semibold">{student.behavior_incidents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-800">Mental Health Score</span>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{student.mental_health_score}/5</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-800">Peer Relationships</span>
                  <span className="font-semibold">{student.peer_relationships_score}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-800">Counselor Visits</span>
                  <span className="font-semibold">{student.counselor_visits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-800">Attendance Rate</span>
                  <span className="font-semibold">{student.attendance.toFixed(1)}%</span>
                </div>
              </div>
              <BehaviorGraph data={student} />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-green-900">Support Network</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-800">Parent Involvement</span>
                  <span className="font-semibold">{student.parent_involvement}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800">Extracurricular Activities</span>
                  <span className="font-semibold">{student.extracurricular_activities}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-800">Study Groups</span>
                  <span className="font-semibold">{student.study_group_participation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800">Tutoring Sessions</span>
                  <span className="font-semibold">{student.tutoring_sessions}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
            </div>
            <div className="flex items-center justify-between">
              <RiskIndicator level={student.riskLevel} />
              <div className="text-right">
                <div className="text-sm text-gray-600">Risk Score</div>
                <div className="text-2xl font-bold text-gray-900">{student.riskScore}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};