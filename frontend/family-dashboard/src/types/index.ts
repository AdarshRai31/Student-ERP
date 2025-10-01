export interface Student {
  id: string;
  name: string;
  photo: string;
  class: string;
  section: string;
  gpa: number;
  attendance: number;
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  role: 'Primary' | 'Secondary';
}

export interface Grade {
  subject: string;
  score: number;
  teacher: string;
  feedback: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
}
