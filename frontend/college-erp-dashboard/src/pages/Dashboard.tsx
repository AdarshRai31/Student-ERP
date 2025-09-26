import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiUserCheck,
  FiTrendingUp, FiCalendar 
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchJSON } from '../utils/api';
import './Dashboard.css';

type MetricResponse = { success: boolean; data: { totalStudents: number; totalFaculty: number; coursesCount: number } };
type TrendItem = { month: string; attendance: number };
type TrendResponse = { success: boolean; data: TrendItem[] };
type NoticesResponse = { success: boolean; data: Array<{ title: string; detail: string; date?: string }> };
type StudentsListResponse = { success: boolean; data: Array<{ name: string; email: string; course: string; status: string }>; count?: number };

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<{ totalStudents: number; totalFaculty: number; coursesCount: number } | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [notices, setNotices] = useState<Array<{ title: string; detail: string; date?: string }>>([]);
  const [students, setStudents] = useState<Array<{ name: string; email: string; course: string; status: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const [m, t, n, s] = await Promise.all([
          fetchJSON<MetricResponse>('/public/metrics'),
          fetchJSON<TrendResponse>('/public/attendance-trend'),
          fetchJSON<NoticesResponse>('/public/notices'),
          fetchJSON<StudentsListResponse>('/public/students?limit=5'),
        ]);
        if (!alive) return;
        setMetrics(m.data);
        setTrend(t.data);
        setNotices(n.data);
        setStudents(s.data || []);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message || 'Failed to load dashboard data');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  type Stat = { icon: React.ElementType; label: string; value: string; change: string };

  const stats: Stat[] = [
    { icon: FiUsers, label: 'Total Students', value: metrics ? metrics.totalStudents.toLocaleString() : '-', change: '' },
    { icon: FiUserCheck, label: 'Faculty', value: metrics ? metrics.totalFaculty.toLocaleString() : '-', change: '' },
    { icon: FiTrendingUp, label: 'Courses', value: metrics ? metrics.coursesCount.toLocaleString() : '-', change: '' },
    { icon: FiCalendar, label: 'Active Months (5)', value: '5', change: '' },
  ];

  const studentSnapshot = students;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      {error && (
        <div className="dashboard-stat-change negative" style={{ marginBottom: 12 }}>{error}</div>
      )}
      {loading && (
        <div className="dashboard-stat-change" style={{ color: 'var(--color-text-muted)', marginBottom: 12 }}>Loading dashboard data...</div>
      )}

      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="dashboard-stat-card"
          >
            <div className="dashboard-stat-content">
              <div className="dashboard-stat-info">
                <p className="dashboard-stat-label">{stat.label}</p>
                <p className="dashboard-stat-value">{stat.value}</p>
                {!!stat.change && (
                  <p className={`dashboard-stat-change ${stat.change.includes('+') ? 'positive' : 'negative'}`}>
                    {stat.change} from last month
                  </p>
                )}
              </div>
              <stat.icon className="dashboard-stat-icon" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Students Snapshot */}
      <div className="dashboard-snapshot-card" style={{ marginBottom: 24 }}>
        <div className="dashboard-snapshot-header">
          <h2 className="dashboard-snapshot-title">Students Snapshot</h2>
          <a href="/students" className="dashboard-link-btn">Manage Students</a>
        </div>
        <div className="dashboard-snapshot-scroll">
          <table className="dashboard-snapshot-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentSnapshot.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ color: 'var(--color-text-muted)' }}>No students found.</td>
                </tr>
              )}
              {studentSnapshot.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        <div className="dashboard-chart-card">
          <h2 className="dashboard-chart-title">Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-chart-card">
          <h2 className="dashboard-chart-title">Latest Notices</h2>
          {!loading && notices.length === 0 && (
            <div className="dashboard-stat-change" style={{ color: 'var(--color-text-muted)' }}>No notices available.</div>
          )}
          <div>
            {notices.map((n, index) => (
              <motion.div
                key={`${n.title}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="dashboard-activity-item"
              >
                <div className="dashboard-activity-bullet" />
                <span className="dashboard-activity-text">{n.title}</span>
                <span className="dashboard-activity-time">{n.date || ''}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;