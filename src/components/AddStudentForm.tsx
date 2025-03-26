import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { Student } from '../types';
import * as XLSX from 'xlsx';

interface AddStudentFormProps {
  onClose: () => void;
  onAdd: (student: Omit<Student, 'riskScore' | 'riskLevel' | 'student_id'>) => Promise<void>;
  onBulkAdd?: (students: Omit<Student, 'riskScore' | 'riskLevel' | 'student_id'>[]) => Promise<void>;
  isLoading?: boolean;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({
  onClose,
  onAdd,
  onBulkAdd,
  isLoading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [students, setStudents] = useState<Omit<Student, 'riskScore' | 'riskLevel' | 'student_id'>[]>([{
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
  }]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const validateForm = (studentData: typeof students[0]) => {
    let newErrors: { [key: string]: string } = {};

    if (!studentData.name.trim()) newErrors.name = 'Name is required';
    if (studentData.grade < 1 || studentData.grade > 12) newErrors.grade = 'Grade must be between 1 and 12';
    if (studentData.gpa < 0 || studentData.gpa > 10) newErrors.gpa = 'GPA must be between 0 and 10';
    if (studentData.attendance < 0 || studentData.attendance > 100) newErrors.attendance = 'Attendance must be between 0 and 100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertToPercentages = (student: typeof students[0]) => {
    // Convert GPA to percentage (GPA is on 10.0 scale)
    const percentage = (student.gpa || 0) * 10;
    const previous_year_percentage = (student.previous_year_gpa || 0) * 10;

    // Test scores are already in percentage
    const math_percentage = student.math_score;
    const science_percentage = student.science_score;
    const english_percentage = student.reading_score;

    return {
      ...student,
      percentage,
      previous_year_percentage,
      math_percentage,
      science_percentage,
      english_percentage,
      // Initialize quarterly data with current values
      q1_percentage: percentage,
      q2_percentage: percentage,
      q3_percentage: percentage,
      q4_percentage: percentage,
      q1_attendance: student.attendance,
      q2_attendance: student.attendance,
      q3_attendance: student.attendance,
      q4_attendance: student.attendance,
      q1_behavior_incidents: student.behavior_incidents,
      q2_behavior_incidents: student.behavior_incidents,
      q3_behavior_incidents: student.behavior_incidents,
      q4_behavior_incidents: student.behavior_incidents
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('processing');

    // Validate all students
    const validationResults = students.map(student => validateForm(student));
    const allStudentsValid = validationResults.every(isValid => isValid);

    if (!allStudentsValid) {
      const firstInvalidIndex = validationResults.findIndex(isValid => !isValid);
      setCurrentStudentIndex(firstInvalidIndex);
      setSubmissionStatus('error');
      alert('Please fix all validation errors before submitting');
      return;
    }

    try {
      // Convert all students' data to include required percentage fields
      const studentsWithPercentages = students.map(student => convertToPercentages(student));

      if (students.length === 1) {
        await onAdd(studentsWithPercentages[0]);
      } else if (onBulkAdd) {
        await onBulkAdd(studentsWithPercentages);
      } else {
        // Fallback for when bulk add isn't available
        for (const student of studentsWithPercentages) {
          await onAdd(student);
        }
      }
      setSubmissionStatus('success');
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
      alert(`Error submitting student data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value, type } = e.target;
    setStudents(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: type === 'number' ? Number(value) || 0 : value
      };
      return updated;
    });
  };

  const processFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (file.type === 'application/json') {
          const result = JSON.parse(event.target?.result as string);

          if (Array.isArray(result)) {
            const isValid = result.every(student =>
              Object.keys(students[0]).every(key => key in student)
            );

            if (isValid) {
              setStudents(result);
              setCurrentStudentIndex(0);
            } else {
              alert('Invalid JSON format - must contain all required fields');
            }
          } else {
            const isValid = Object.keys(students[0]).every(key => key in result);
            if (isValid) {
              setStudents([result]);
              setCurrentStudentIndex(0);
            } else {
              alert('Invalid JSON format - must contain all required fields');
            }
          }
        } else {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);

          if (parsedData.length > 0) {
            const isValid = parsedData.every((row: any) =>
              Object.keys(students[0]).every(key => key in row)
            );

            if (isValid) {
              setStudents(parsedData as Omit<Student, 'riskScore' | 'riskLevel' | 'student_id'>[]);
              setCurrentStudentIndex(0);
            } else {
              alert('Invalid Excel format - must contain all required fields');
            }
          }
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please check the format.');
      }
    };

    if (file.type === 'application/json') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleNextStudent = () => {
    if (validateForm(students[currentStudentIndex])) {
      setCurrentStudentIndex(prev => Math.min(prev + 1, students.length - 1));
    }
  };

  const handlePrevStudent = () => {
    setCurrentStudentIndex(prev => Math.max(prev - 1, 0));
  };

  const currentStudent = students[currentStudentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {students.length > 1 ? 'Add Multiple Students' : 'Add New Student'}
              </h2>
              {students.length > 1 && (
                <p className="text-sm text-gray-500">
                  Student {currentStudentIndex + 1} of {students.length}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading || submissionStatus === 'processing'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {students.length > 1 && (
            <div className="flex justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevStudent}
                disabled={currentStudentIndex === 0 || submissionStatus === 'processing'}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextStudent}
                disabled={currentStudentIndex === students.length - 1 || submissionStatus === 'processing'}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-blue-900">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentStudent.name}
                    onChange={(e) => handleChange(e, currentStudentIndex)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={isLoading || submissionStatus === 'processing'}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <select
                    name="grade"
                    value={currentStudent.grade}
                    onChange={(e) => handleChange(e, currentStudentIndex)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading || submissionStatus === 'processing'}
                  >
                    {[5, 6, 7, 8, 9, 10].map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                  {errors.grade && <p className="text-red-500 text-sm">{errors.grade}</p>}
                </div>
              </div>

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
                      value={currentStudent[item.name as keyof typeof currentStudent]}
                      onChange={(e) => handleChange(e, currentStudentIndex)}
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      disabled={isLoading || submissionStatus === 'processing'}
                    />
                    {errors[item.name] && <p className="text-red-500 text-sm">{errors[item.name]}</p>}
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
                        value={currentStudent[item.name]}
                        onChange={(e) => handleChange(e, currentStudentIndex)}
                        min="0"
                        max="100"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        disabled={isLoading || submissionStatus === 'processing'}
                      />
                    </div>
                  ))}
                </div>
              </div>

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
                      value={currentStudent[item.name]}
                      onChange={(e) => handleChange(e, currentStudentIndex)}
                      min={item.min}
                      max={item.max}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      disabled={isLoading || submissionStatus === 'processing'}
                    />
                    {errors[item.name] && <p className="text-red-500 text-sm">{errors[item.name]}</p>}
                  </div>
                ))}
              </div>

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
                      value={currentStudent[item.name]}
                      onChange={(e) => handleChange(e, currentStudentIndex)}
                      min={item.min}
                      max={item.max || undefined}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                      disabled={isLoading || submissionStatus === 'processing'}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center text-gray-500 hover:border-blue-500 cursor-pointer"
            >
              <p>Drag & drop a JSON/Excel file here, or <span className="text-blue-500 underline">click to select</span></p>
              <p className="text-sm mt-2">For multiple students, upload an Excel file or JSON array</p>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json,.xls,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md"
                disabled={isLoading || submissionStatus === 'processing'}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading || submissionStatus === 'processing'}
              >
                {submissionStatus === 'processing' ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {students.length > 1 ? 'Saving All...' : 'Saving...'}
                  </span>
                ) : students.length > 1 ? 'Save All Students' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};