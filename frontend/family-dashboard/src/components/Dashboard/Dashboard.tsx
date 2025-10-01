import React from 'react';
import { StatsCards } from './StatsCards';
import { Charts } from './Charts';
import { NotificationsPanel } from './NotificationsPanel';
import { StudentInfo } from '../Profile/StudentInfo';
import { GuardianDetails } from '../Profile/GuardianDetails';
import { EmergencyContact } from '../Profile/EmergencyContact';
import { ProgressTable } from '../Academic/ProgressTable';
import { AssignmentsList } from '../Academic/AssignmentsList';
import { ExamResults } from '../Academic/ExamResults';
import { AttendanceCalendar } from '../Attendance/AttendanceCalendar';
import { MessagingUI } from '../Communication/MessagingUI';
import { MeetingSchedule } from '../Communication/MeetingSchedule';
import { FeeStatus } from '../Financial/FeeStatus';
import { PaymentHistory } from '../Financial/PaymentHistory';
import { BusTracker } from '../Transport/BusTracker';
import { TransportLogs } from '../Transport/TransportLogs';
import { AnalyticsDashboard } from '../Reports/AnalyticsDashboard';
import { RecommendationsBanner } from './RecommendationsBanner';
import './Dashboard.css';
  
// Mock data
const mockData = {
  student: {
    id: '1',
    name: 'John Smith',
    photo: '/student.jpg',
    class: '10',
    section: 'A',
    gpa: 3.8,
    attendance: 95
  },
  guardians: [
    {
      id: '1',
      name: 'Jane Smith',
      relationship: 'Mother',
      phone: '+1 (555) 123-4567',
      email: 'jane.smith@email.com',
      role: 'Primary' as const
    },
    {
      id: '2',
      name: 'Robert Smith',
      relationship: 'Father',
      phone: '+1 (555) 987-6543',
      email: 'robert.smith@email.com',
      role: 'Secondary' as const
    }
  ],
  emergencyContacts: [
    {
      id: '1',
      name: 'Grandma Smith',
      relationship: 'Grandmother',
      phone: '+1 (555) 111-2233',
      email: 'grandma@email.com',
      priority: 1
    }
  ],
  grades: [
    {
      subject: 'Mathematics',
      score: 88,
      teacher: 'Dr. Johnson',
      feedback: 'Excellent progress, keep practicing problems',
      trend: 'up' as const
    },
    {
      subject: 'Science',
      score: 92,
      teacher: 'Mrs. Williams',
      feedback: 'Outstanding performance in labs',
      trend: 'stable' as const
    }
  ],
  assignments: [
    {
      id: '1',
      title: 'Algebra Homework',
      subject: 'Mathematics',
      dueDate: '2023-10-15',
      status: 'completed' as const,
      priority: 'high' as const
    },
    {
      id: '2',
      title: 'Science Project',
      subject: 'Science',
      dueDate: '2023-10-20',
      status: 'pending' as const,
      priority: 'medium' as const
    }
  ],
  examResults: [
    {
      subject: 'Mathematics',
      score: 88,
      maxScore: 100,
      classAverage: 75,
      grade: 'A'
    },
    {
      subject: 'Science',
      score: 92,
      maxScore: 100,
      classAverage: 78,
      grade: 'A+'
    }
  ]
};

export const Dashboard: React.FC = () => {
  return (
    <div className="dashboard" id="dashboard">
      <RecommendationsBanner recommendations={[
        {
          id: '1',
          title: 'Focus on Math',
          message: 'Your child\'s math scores have decreased by 5% compared to last month. Consider spending extra time on math practice.',
          priority: 'medium',
          category: 'academic',
          actionLabel: 'View Math Resources'
        }
      ]} />
      
      <div className="dashboard-header">
        <h2>Family Dashboard</h2>
        <NotificationsPanel notifications={[]} />
      </div>
      
      <StatsCards 
        gpa={3.8}
        attendance={95}
        feesDue={250}
        upcomingEvents={3}
      />
      
      <div className="dashboard-content">
        <div className="main-content">
          <Charts />
          
          <div className="profile-section">
            <StudentInfo student={mockData.student} />
            <GuardianDetails guardians={mockData.guardians} />
            <EmergencyContact contacts={mockData.emergencyContacts} />
          </div>
          
          <div className="academic-section" id="academics">
            <h3>Academic Performance</h3>
            <div className="academic-content">
              <ProgressTable grades={mockData.grades} />
              <AssignmentsList assignments={mockData.assignments} />
              <ExamResults results={mockData.examResults} examName="Mid-Term" examDate="2023-10-15" />
            </div>
          </div>
          
          <div className="attendance-section" id="attendance">
            <h3>Attendance Tracking</h3>
            <AttendanceCalendar />
          </div>
        </div>
        
        <div className="sidebar-content" id="communication">
          <MessagingUI />
          <MeetingSchedule meetings={[]} />
        </div>
      </div>
      
      <div className="financial-section" id="fees">
        <h3>Financial Management</h3>
        <div className="financial-content">
          <FeeStatus 
            totalAmount={1200}
            paidAmount={950}
            dueDate={new Date('2023-11-15')}
            status="partial"
          />
          <PaymentHistory payments={[]} />
        </div>
      </div>
      
      <div className="transport-section" id="transport">
        <h3>Transport Tracking</h3>
        <div className="transport-content">
          <BusTracker />
          <TransportLogs logs={[]} />
        </div>
      </div>
      
      <div className="reports-section" id="reports">
        <h3>Reports & Analytics</h3>
        <AnalyticsDashboard />
      </div>
    </div>
  );
};
