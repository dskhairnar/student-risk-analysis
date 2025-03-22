export interface Student {
  student_id: string;
  name: string;
  grade: number;
  attendance: number;
  percentage: number;
  gpa?: number;
  missed_assignments: number;
  behavior_incidents: number;
  counselor_visits: number;
  extracurricular_activities: number;
  parent_involvement: number;
  previous_year_percentage: number;
  english_percentage: number;
  math_percentage: number;
  science_percentage: number;
  absences_last_year: number;
  late_assignments: number;
  study_group_participation: number;
  tutoring_sessions: number;
  mental_health_score: number;
  peer_relationships_score: number;
  q1_percentage: number;
  q2_percentage: number;
  q3_percentage: number;
  q4_percentage: number;
  q1_attendance: number;
  q2_attendance: number;
  q3_attendance: number;
  q4_attendance: number;
  q1_behavior_incidents: number;
  q2_behavior_incidents: number;
  q3_behavior_incidents: number;
  q4_behavior_incidents: number;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export const calculateRiskScore = (student: Omit<Student, 'riskScore' | 'riskLevel'>): number => {
  // Academic Performance (40%)
  const academicScore = (
    ((100 - student.percentage) / 100) * 0.4 +
    ((100 - student.math_percentage) / 100) * 0.3 +
    ((100 - student.science_percentage) / 100) * 0.3
  ) * 40;

  // Attendance & Engagement (30%)
  const attendanceScore = (
    ((100 - student.attendance) / 100) * 0.4 +
    (student.absences_last_year / 15) * 0.3 +
    (student.missed_assignments / 10) * 0.3
  ) * 30;

  // Social & Behavioral (20%)
  const socialScore = (
    (student.behavior_incidents / 5) * 0.3 +
    ((5 - student.mental_health_score) / 5) * 0.4 +
    ((5 - student.peer_relationships_score) / 5) * 0.3
  ) * 20;

  // Support System (10%)
  const supportScore = (
    ((5 - student.parent_involvement) / 5) * 0.4 +
    ((3 - student.extracurricular_activities) / 3) * 0.3 +
    ((3 - (student.study_group_participation + student.tutoring_sessions)) / 3) * 0.3
  ) * 10;

  return Math.round(academicScore + attendanceScore + socialScore + supportScore);
};

export const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' => {
  if (score < 30) return 'Low';
  if (score < 60) return 'Medium';
  return 'High';
};