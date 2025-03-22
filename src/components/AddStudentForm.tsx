import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Student } from '../types';

interface AddStudentFormProps {
  onClose: () => void;
  onAdd: (student: Omit<Student, 'riskScore' | 'riskLevel' | 'student_id'>) => void;
  isLoading?: boolean;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ onClose, onAdd, isLoading = false }) => {
  const [formData, setFormData] = useState<Omit<Student, 'riskScore' | 'riskLevel' | 'student_id'>>({
    name: '',
    grade: 5,
    attendance: 100,
    gpa: 10.0,
    missed_assignments: 0,
    behavior_incidents: 0,
    counselor_visits: 0,
    extracurricular_activities: 0,
    parent_involvement: 5,
    previous_year_gpa: 10.0,
    reading_score: 100,
    math_score: 100,
    science_score: 100,
    absences_last_year: 0,
    late_assignments: 0,
    study_group_participation: 0,
    tutoring_sessions: 0,
    mental_health_score: 5,
    peer_relationships_score: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) || 0 : value
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = JSON.parse(event.target?.result as string);

          // Validate JSON format
          const isValid = Object.keys(formData).every(key => key in result);
          if (isValid) {
            setFormData(prev => ({
              ...prev,
              ...result
            }));
          } else {
            alert('Invalid JSON format');
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON content');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-blue-500');
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={isLoading}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Basic Information */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-blue-900">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    {[5, 6, 7, 8, 9, 10].map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="bg-green-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-green-900">Academic Performance</h3>
                {[
                  { label: 'Current GPA (0-10)', name: 'gpa', min: 0, max: 10, step: 0.1 },
                  { label: 'Previous Year GPA (0-10)', name: 'previous_year_gpa', min: 0, max: 10, step: 0.1 },
                ].map((item) => (
                  <div key={item.name}>
                    <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                    <input
                      type="number"
                      name={item.name}
                      value={formData[item.name as keyof typeof formData]}
                      onChange={handleChange}
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      disabled={isLoading}
                    />
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Math Score', name: 'math_score' },
                    { label: 'Reading Score', name: 'reading_score' },
                    { label: 'Science Score', name: 'science_score' },
                  ].map((item) => (
                    <div key={item.name}>
                      <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                      <input
                        type="number"
                        name={item.name}
                        value={formData[item.name]}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Metrics */}
              <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-purple-900">Behavioral Metrics</h3>
                {[
                  { label: 'Attendance Rate (%)', name: 'attendance', min: 0, max: 100 },
                  { label: 'Behavior Incidents', name: 'behavior_incidents', min: 0 },
                  { label: 'Mental Health Score (1-5)', name: 'mental_health_score', min: 1, max: 5 },
                  { label: 'Peer Relationships Score (1-5)', name: 'peer_relationships_score', min: 1, max: 5 },
                ].map((item) => (
                  <div key={item.name}>
                    <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                    <input
                      type="number"
                      name={item.name}
                      value={formData[item.name]}
                      onChange={handleChange}
                      min={item.min}
                      max={item.max}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>

              {/* Support Network */}
              <div className="bg-orange-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-orange-900">Support Network</h3>
                {[
                  { label: 'Parent Involvement (1-5)', name: 'parent_involvement', min: 1, max: 5 },
                  { label: 'Extracurricular Activities', name: 'extracurricular_activities', min: 0 },
                  { label: 'Study Group Participation', name: 'study_group_participation', min: 0 },
                  { label: 'Tutoring Sessions', name: 'tutoring_sessions', min: 0 },
                ].map((item) => (
                  <div key={item.name}>
                    <label className="block text-sm font-medium text-gray-700">{item.label}</label>
                    <input
                      type="number"
                      name={item.name}
                      value={formData[item.name]}
                      onChange={handleChange}
                      min={item.min}
                      max={item.max || undefined}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center text-gray-500 cursor-pointer"
            >
              Drag and drop a JSON file here or click to upload
            </div>


            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};