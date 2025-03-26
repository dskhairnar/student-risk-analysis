import { Student, calculateRiskScore, getRiskLevel } from './types';

const STORAGE_KEY = 'student-risk-analysis-data';

const loadStudentsFromStorage = (): Student[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading students:', error);
    return [];
  }
};

export const saveStudentsToStorage = (students: Student[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Error saving students:', error);
  }
};

export const generateStudentId = (existingIds: string[]): string => {
  let counter = existingIds.length + 1;
  let newId = `S${String(counter).padStart(3, '0')}`;
  
  while (existingIds.includes(newId)) {
    counter++;
    newId = `S${String(counter).padStart(3, '0')}`;
  }
  
  return newId;
};

const parseCSV = (csv: string): Student[] => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const student: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      student[header.trim()] = isNaN(Number(value)) ? value : Number(value);
    });

    // Calculate risk score and level
    const riskScore = calculateRiskScore(student);
    return {
      ...student,
      riskScore,
      riskLevel: getRiskLevel(riskScore)
    };
  });
};

export const initialStudents = loadStudentsFromStorage();