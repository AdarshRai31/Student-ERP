import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiUserCheck,
  FiTrendingUp, FiCalendar 
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchJSON } from '../utils/api';

type MetricResponse = { success: boolean; data: { totalStudents: number; totalFaculty: number; coursesCount: number } };
type TrendItem = { month: string; attendance: number };
type TrendResponse = { success: boolean; data: TrendItem[] };
type NoticesResponse = { success: boolean; data: Array<{ title: string; detail: string; date?: string }> };

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<{ totalStudents: number; totalFaculty: number; coursesCount: number } | null>(null);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [notices, setNotices] = useState<Array<{ title: string; detail: string; date?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const [m, t, n] = await Promise.all([
          fetchJSON<MetricResponse>('/public/metrics'),
          fetchJSON<TrendResponse>('/public/attendance-trend'),
          fetchJSON<NoticesResponse>('/public/notices'),
        ]);
        if (!alive) return;
        setMetrics(m.data);
        setTrend(t.data);
        setNotices(n.data);
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

  const stats = [
    { icon: FiUsers, label: 'Total Students', value: metrics ? metrics.totalStudents.toLocaleString() : '-', change: '' },
    { icon: FiUserCheck, label: 'Faculty', value: metrics ? metrics.totalFaculty.toLocaleString() : '-', change: '' },
    { icon: FiTrendingUp, label: 'Courses', value: metrics ? metrics.coursesCount.toLocaleString() : '-', change: '' },
    { icon: FiCalendar, label: 'Active Months (5)', value: '5', change: '' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      {error && (
        <div className="mb-4 text-sm text-red-500">{error}</div>
      )}
      {loading && (
        <div className="mb-4 text-sm text-gray-500">Loading dashboard data...</div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                {!!stat.change && (
                  <p className={`text-sm ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </p>
                )}
              </div>
              <stat.icon className="w-8 h-8 text-primary-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Attendance Trend</h2>
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Latest Notices</h2>
          {!loading && notices.length === 0 && (
            <div className="text-sm text-gray-500">No notices available.</div>
          )}
          <div className="space-y-4">
            {notices.map((n, index) => (
              <motion.div
                key={`${n.title}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-sm">{n.title}</span>
                <span className="text-xs text-gray-500 ml-auto">{n.date || ''}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;