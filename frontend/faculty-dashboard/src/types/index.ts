// src/types/index.ts
export interface Faculty {
  id: string;
  name: string;
  department: string;
  subjects: string[];
  contact: {
    email: string;
    phone: string;
    office: string;
  };
  qualification: string;
  joiningDate: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  section: string;
  performance: {
    assignments: number;
    exams: number;
    attendance: number;
  };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
  section: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  section: string;
  deadline: string;
  maxGrade: number;
  description: string;
  attachments: string[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  grade?: number;
  feedback?: string;
  file: string;
}

export interface Grade {
  assignmentId: string;
  studentId: string;
  grade: number;
  feedback?: string;
}

export interface Timetable {
  id: string;
  subject: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  section: string;
  type: 'notes' | 'ppt' | 'assignment' | 'other';
  uploadDate: string;
  file: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  subject: string;
  section: string;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  link: string;
  abstract: string;
}
