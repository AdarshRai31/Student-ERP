import React, { useEffect, useMemo, useState } from "react";
import "./style.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProfileCard from "./components/ProfileCard";
import StatsSection from "./components/StatsSection";
import AttendanceSection from "./components/AttendanceSection";
import ExamsSection from "./components/ExamsSection";
import AssignmentsSection from "./components/AssignmentsSection";
import FeesSection from "./components/FeesSection";
import LibrarySection from "./components/LibrarySection";
import NoticesSection from "./components/NoticesSection";
import MessagesSection from "./components/MessagesSection";
import Login from "./pages/Login";
import { getToken } from "./utils/auth";

import { Student, Stats } from "./types";
import { fetchJSON } from "./utils/api";

const mockStudent: Student = {
  name: "Arjun Sharma",
  rollNumber: "CS21B1001",
  course: "BTech Computer Science",
  year: "3rd Year",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  email: "arjun.sharma@college.edu",
  phone: "+91 9876543210",
};

const mockStats: Stats = { attendance: 0, cgpa: 0, upcomingExams: 0, feesDue: 0 };

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(getToken());
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [stats, setStats] = useState<Stats>(mockStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentEmail = useMemo(() => {
    const keys = [
      'userEmail', 'email', 'username',
      'auth_user_email', 'auth_username'
    ];
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v && v.includes('@')) return v;
      if (v) return v;
    }
    try {
      const blob = localStorage.getItem('auth_user') || localStorage.getItem('user');
      if (blob) {
        const obj = JSON.parse(blob);
        return obj?.email || obj?.username || '';
      }
    } catch {}
    return '';
  }, []);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0,10);
        const [attendanceRes, financeRes, examsRes] = await Promise.all([
          fetchJSON<{ success: boolean; data: Array<{ date: string; status: string }> }>(
            studentEmail ? `/public/attendance?student=${encodeURIComponent(studentEmail)}` : `/public/attendance`
          ),
          fetchJSON<{ success: boolean; data: { total: number; paid: number; pending: number } }>(
            studentEmail ? `/public/finance-summary?student=${encodeURIComponent(studentEmail)}` : `/public/finance-summary`
          ),
          fetchJSON<{ success: boolean; data: Array<{ id: string; name?: string; date?: string; type?: string; status?: string }> }>(
            studentEmail ? `/public/exams?student=${encodeURIComponent(studentEmail)}` : `/public/exams`
          ),
        ]);

        if (!alive) return;
        // Attendance percentage
        const recs = attendanceRes.data || [];
        const acc = recs.reduce((a, r) => {
          a.total += 1;
          const st = (r.status || '').toLowerCase();
          if (st === 'present' || st === 'late') a.presentish += 1;
          return a;
        }, { total: 0, presentish: 0 });
        const attendancePct = acc.total > 0 ? Math.round((acc.presentish / acc.total) * 100) : 0;

        // Fees due
        const feesDue = Number(financeRes.data?.pending || 0);

        // Upcoming exams count (date today or future)
        const upcomingExams = (examsRes.data || []).filter(e => (e.date || '') >= today).length;

        setStats({ attendance: attendancePct, cgpa: 0, upcomingExams, feesDue });
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load dashboard stats');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [studentEmail]);

  // Validate token on load
  useEffect(() => {
    if (!token) return;
    fetchJSON('/user/me').catch(() => {
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_username');
      } catch {}
      setToken(null);
    });
  }, [token]);

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return (
          <>
            <ProfileCard student={mockStudent} />
            {error && <div className="text-sm text-red-500">{error}</div>}
            <StatsSection stats={stats} />
            <AttendanceSection limit={10} />
            <ExamsSection />
            <AssignmentsSection />
            <FeesSection />
            <LibrarySection />
            <NoticesSection />
            <MessagesSection />
          </>
        );
      case "profile":
        return <ProfileCard student={mockStudent} />;
      case "attendance":
        return <AttendanceSection />;
      case "exams":
        return <ExamsSection />;
      case "assignments":
        return <AssignmentsSection />;
      case "fees":
        return <FeesSection />;
      case "library":
        return <LibrarySection />;
      case "notices":
        return <NoticesSection />;
      case "communication":
        return <MessagesSection />;
      case "settings":
        return <div>Settings Section (to be implemented)</div>;
      default:
        return <div>Section not found</div>;
    }
  };

  if (!token) {
    return (
      <Login onSuccess={(t) => setToken(t)} />
    );
  }

  return (
    <div className="app-container">
      <Sidebar onNavigate={setCurrentSection} />
      <main className="main-content">
        <Topbar title={currentSection} />
        {loading && <div className="loading-hint">Loading...</div>}
        <div className="dashboard-content">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default App;
