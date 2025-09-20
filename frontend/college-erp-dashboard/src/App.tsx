import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import FacultyManagement from './pages/FacultyManagement';
import CourseManagement from './pages/CourseManagement';
import AcademicCalendar from './pages/AcademicCalendar';
import FinanceManagement from './pages/FinanceManagement';
import AttendanceExams from './pages/AttendanceExams';
import LibraryManagement from './pages/LibraryManagement';
import NoticeBoard from './pages/NoticeBoard';
import AnalyticsReports from './pages/AnalyticsReports';
import HelpdeskSupport from './pages/HelpdeskSupport';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed}
          isMobile={isMobile}
          setIsMobileOpen={setIsMobileOpen}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar 
            onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
          />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/faculty" element={<FacultyManagement />} />
              <Route path="/courses" element={<CourseManagement />} />
              <Route path="/academic-calendar" element={<AcademicCalendar />} />
              <Route path="/finance" element={<FinanceManagement />} />
              <Route path="/attendance" element={<AttendanceExams />} />
              <Route path="/library" element={<LibraryManagement />} />
              <Route path="/notices" element={<NoticeBoard />} />
              <Route path="/analytics" element={<AnalyticsReports />} />
              <Route path="/support" element={<HelpdeskSupport />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
