// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

import DashboardHome from './components/Dashboard/DashboardHome';
import FacultyProfile from './components/Profile/FacultyProfile';
import ClassManager from './components/ClassManagement/ClassManager';
import TimetableUpload from './components/ClassManagement/TimetableUpload';
import MaterialsUpload from './components/ClassManagement/MaterialsUpload';
import AttendanceManager from './components/Attendance/AttendanceManager';
import AttendanceReport from './components/Attendance/AttendanceReport';
import AssignmentManager from './components/Assignments/AssignmentManager';
import GradeSubmissions from './components/Assignments/GradeSubmissions';
import StudentPerformance from './components/Performance/StudentPerformance';
import ReportsGenerator from './components/Performance/ReportsGenerator';
import Announcements from './components/Communication/Announcements';
import Messaging from './components/Communication/Messaging';
import Helpdesk from './components/Communication/Helpdesk';
import ResearchSection from './components/Research/ResearchSection';

import './App.css';

const App: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false); // close sidebar when leaving mobile
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="app">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <div className="main-content">
          <Header onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/profile" element={<FacultyProfile />} />
              <Route path="/classes" element={<ClassManager />} />
              <Route path="/timetable" element={<TimetableUpload />} />
              <Route path="/materials" element={<MaterialsUpload />} />
              <Route path="/attendance" element={<AttendanceManager />} />
              <Route path="/attendance-reports" element={<AttendanceReport />} />
              <Route path="/assignments" element={<AssignmentManager />} />
              <Route path="/grading" element={<GradeSubmissions />} />
              <Route path="/performance" element={<StudentPerformance />} />
              <Route path="/reports" element={<ReportsGenerator />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/helpdesk" element={<Helpdesk />} />
              <Route path="/research" element={<ResearchSection />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
