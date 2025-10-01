import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Define response data types
export interface LoginResponse {
  token: string;
  faculty: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('faculty_token');
    if (token && config.headers) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('faculty_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Faculty API calls
export const facultyAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', credentials),
  
  getProfile: () => api.get('/faculty/profile'),
  
  updateProfile: (data: any) => api.put('/faculty/profile', data),
  
  getClasses: () => api.get('/faculty/classes'),
  
  getTimetable: () => api.get('/faculty/timetable'),
  
  uploadTimetable: (formData: FormData) =>
    api.post('/faculty/timetable', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getAttendance: (params: { subject?: string; section?: string; date?: string }) =>
    api.get('/faculty/attendance', { params }),
  
  markAttendance: (data: any) => api.post('/faculty/attendance', data),
  
  getAttendanceReports: (params: { subject?: string; section?: string; month?: string }) =>
    api.get('/faculty/attendance/reports', { params }),
  
  getAssignments: () => api.get('/faculty/assignments'),
  
  createAssignment: (data: any) => api.post('/faculty/assignments', data),
  
  getSubmissions: (assignmentId: string) =>
    api.get(`/faculty/assignments/${assignmentId}/submissions`),
  
  gradeSubmission: (assignmentId: string, submissionId: string, data: { grade: number; feedback?: string }) =>
    api.put(`/faculty/assignments/${assignmentId}/submissions/${submissionId}`, data),
  
  getStudentPerformance: (params: { subject?: string; section?: string }) =>
    api.get('/faculty/performance', { params }),
  
  sendAnnouncement: (data: any) => api.post('/faculty/announcements', data),
  
  getMessages: () => api.get('/faculty/messages'),
  
  sendMessage: (data: any) => api.post('/faculty/messages', data),
  
  getResearchPapers: () => api.get('/faculty/research'),
  
  addResearchPaper: (data: any) => api.post('/faculty/research', data),
};

export default api;
