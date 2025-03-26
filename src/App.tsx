import React, { useState } from 'react';
import { initialStudents, generateStudentId, saveStudentsToStorage } from './data';
import { RiskIndicator } from './components/RiskIndicator';
import { StudentDetails } from './components/StudentDetails';
import { MetricsCard } from './components/MetricsCard';
import { AddStudentForm } from './components/AddStudentForm';
import { AlertCircle, BookOpen, Brain, Users, UserPlus } from 'lucide-react';
import { Student, calculateRiskScore, getRiskLevel } from './types';
import { AcademicOverviewGraph } from './components/AcademicOverviewGraph';
import { BehaviorOverviewGraph } from './components/BehaviorOverviewGraph';
import { SupportOverviewGraph } from './components/SupportOverviewGraph';

function App() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedRisk, setSelectedRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredStudents = selectedRisk === 'All'
    ? students
    : students.filter(student => student.riskLevel === selectedRisk);

  const riskCounts = {
    High: students.filter(s => s.riskLevel === 'High').length,
    Medium: students.filter(s => s.riskLevel === 'Medium').length,
    Low: students.filter(s => s.riskLevel === 'Low').length,
  };

  // Calculate metrics
  const avgPercentage = students.reduce((sum, s) => sum + s.percentage, 0) / students.length;
  const avgAttendance = students.reduce((sum, s) => sum + s.attendance, 0) / students.length;
  const totalIncidents = students.reduce((sum, s) => sum + s.behavior_incidents, 0);
  const avgMentalHealth = students.reduce((sum, s) => sum + s.mental_health_score, 0) / students.length;
  const avgParentInvolvement = students.reduce((sum, s) => sum + s.parent_involvement, 0) / students.length;
  const totalActivities = students.reduce((sum, s) => sum + s.extracurricular_activities, 0);

  const handleAddStudent = async (studentData: Omit<Student, 'riskScore' | 'riskLevel' | 'student_id'>) => {
    try {
      setIsLoading(true);
      const newStudentId = generateStudentId(students.map(s => s.student_id));
      const studentWithId = {
        ...studentData,
        student_id: newStudentId
      };
      const riskScore = calculateRiskScore(studentWithId);
      const newStudent: Student = {
        ...studentWithId,
        riskScore,
        riskLevel: getRiskLevel(riskScore)
      };

      const updatedStudents = [...students, newStudent];
      setStudents(updatedStudents);
      saveStudentsToStorage(updatedStudents);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">School Student Risk Analysis Dashboard</h1>
            <p className="mt-2 text-gray-600">Early intervention system for grades 5-10 using data analysis</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            <UserPlus className="w-5 h-5" />
            {isLoading ? 'Adding...' : 'Add Student'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Risk Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['High', 'Medium', 'Low'] as const).map((level) => (
            <div
              key={level}
              className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRisk(level)}
            >
              <div className="flex justify-between items-center">
                <RiskIndicator level={level} />
                <span className="text-2xl font-bold">{riskCounts[level]}</span>
              </div>
              <p className="text-gray-600 mt-2">Students at {level} Risk</p>
            </div>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricsCard
            icon={BookOpen}
            title="Academic Performance"
            description="Based on percentage, test scores, and assignments"
            metrics={[
              { label: 'Average Percentage', value: `${avgPercentage.toFixed(1)}%` },
              { label: 'Below 60%', value: students.filter(s => s.percentage < 60).length },
              { label: 'Missing Assignments', value: students.reduce((sum, s) => sum + s.missed_assignments, 0) },
            ]}
            bgColor="bg-white"
            iconColor="text-blue-500"
            graph={<AcademicOverviewGraph students={students} />}
          />
          <MetricsCard
            icon={Brain}
            title="Behavioral Analysis"
            description="Considers behavior, mental health, and engagement"
            metrics={[
              { label: 'Attendance Rate', value: `${avgAttendance.toFixed(1)}%` },
              { label: 'Total Incidents', value: totalIncidents },
              { label: 'Avg Mental Health', value: `${avgMentalHealth.toFixed(1)}/5` },
            ]}
            bgColor="bg-white"
            iconColor="text-purple-500"
            graph={<BehaviorOverviewGraph students={students} />}
          />
          <MetricsCard
            icon={Users}
            title="Support Network"
            description="Evaluates support systems and involvement"
            metrics={[
              { label: 'Parent Involvement', value: `${avgParentInvolvement.toFixed(1)}/5` },
              { label: 'Total Activities', value: totalActivities },
              { label: 'Students in Study Groups', value: students.filter(s => s.study_group_participation > 0).length },
            ]}
            bgColor="bg-white"
            iconColor="text-green-500"
            graph={<SupportOverviewGraph students={students} />}
          />
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {['All', 'High', 'Medium', 'Low'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk as any)}
              className={`px-4 py-2 rounded-lg ${selectedRisk === risk
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              {risk}
            </button>
          ))}
        </div>

        {/* Student List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Behavioral
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Support
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student.student_id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Grade {student.grade}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Overall: {student.percentage}%</div>
                    <div className="text-xs text-gray-500">
                      Math: {student.math_percentage}% | English: {student.english_percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Incidents: {student.behavior_incidents}
                    </div>
                    <div className="text-xs text-gray-500">
                      Mental Health: {student.mental_health_score}/5
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Parent Involvement: {student.parent_involvement}/5
                    </div>
                    <div className="text-xs text-gray-500">
                      Activities: {student.extracurricular_activities}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RiskIndicator level={student.riskLevel} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.riskScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {showAddForm && (
        <AddStudentForm
          onClose={() => setShowAddForm(false)}
          onAdd={handleAddStudent}
          onBulkAdd={async (students) => {
            try {
              setIsLoading(true);
              const newStudents = students.map(studentData => {
                const newStudentId = generateStudentId(students.map(s => s.student_id));
                const studentWithId = {
                  ...studentData,
                  student_id: newStudentId
                };
                const riskScore = calculateRiskScore(studentWithId);
                return {
                  ...studentWithId,
                  riskScore,
                  riskLevel: getRiskLevel(riskScore)
                };
              });
              setStudents(prevStudents => {
                const updatedStudents = [...prevStudents, ...newStudents];
                saveStudentsToStorage(updatedStudents);
                return updatedStudents;
              });
              setShowAddForm(false);
              setError(null);
            } catch (err) {
              console.error('Error adding students:', err);
              setError('Failed to add students. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default App;