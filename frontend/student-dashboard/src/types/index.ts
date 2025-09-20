export interface Student {
  name: string;
  rollNumber: string;
  course: string;
  year: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface Stats {
  attendance: number;
  cgpa: number;
  upcomingExams: number;
  feesDue: number;
}

export interface Exam {
  id: number;
  name: string;
  date: string;
  status: string;
  type: string;
}

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: string;
  priority: "High" | "Medium" | "Low";
}

export interface Fee {
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
}

export interface Book {
  id: number;
  bookName: string;
  author: string;
  issueDate: string;
  dueDate: string;
  status: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: string;
  type: string;
}

export interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: "sent" | "received";
}
