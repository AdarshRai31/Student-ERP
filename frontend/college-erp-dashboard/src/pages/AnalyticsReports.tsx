import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFilter, FiTrendingUp, FiUsers, FiBook, FiDollarSign } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const performanceData = [
  { subject: 'Mathematics', average: 75, highest: 95, lowest: 45 },
  { subject: 'Physics', average: 68, highest: 92, lowest: 40 },
  { subject: 'Chemistry', average: 72, highest: 88, lowest: 50 },
  { subject: 'English', average: 80, highest: 98, lowest: 55 },
  { subject: 'Computer Science', average: 85, highest: 100, lowest: 60 },
];

const departmentData = [
  { name: 'Computer Science', value: 35 },
  { name: 'Electrical', value: 25 },
  { name: 'Mechanical', value: 20 },
  { name: 'Civil', value: 15 },
  { name: 'Chemical', value: 5 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AnalyticsReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<'performance' | 'attendance' | 'financial' | 'workload'>('performance');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <div className="flex space-x-2">
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center">
            <FiFilter className="mr-2" /> Filter
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center">
            <FiDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Student Performance</p>
              <p className="text-2xl font-bold">76.5%</p>
              <p className="text-sm text-green-600">+5.2% from last term</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Attendance</p>
              <p className="text-2xl font-bold">88.3%</p>
              <p className="text-sm text-green-600">+2.1% from last month</p>
            </div>
            <FiUsers className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fee Collection Rate</p>
              <p className="text-2xl font-bold">92.7%</p>
              <p className="text-sm text-green-600">+3.8% from last term</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Faculty Workload</p>
              <p className="text-2xl font-bold">18.2h</p>
              <p className="text-sm text-red-600">-2.4h from last term</p>
            </div>
            <FiBook className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${selectedReport === 'performance' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setSelectedReport('performance')}
        >
          Academic Performance
        </button>
        <button
          className={`px-4 py-2 font-medium ${selectedReport === 'attendance' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setSelectedReport('attendance')}
        >
          Attendance Analysis
        </button>
        <button
          className={`px-4 py-2 font-medium ${selectedReport === 'financial' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setSelectedReport('financial')}
        >
          Financial Reports
        </button>
        <button
          className={`px-4 py-2 font-medium ${selectedReport === 'workload' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setSelectedReport('workload')}
        >
          Workload Distribution
        </button>
      </div>

      {selectedReport === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Subject-wise Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#3b82f6" name="Average Score" />
                <Bar dataKey="highest" fill="#10b981" name="Highest Score" />
                <Bar dataKey="lowest" fill="#ef4444" name="Lowest Score" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}

                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {selectedReport === 'attendance' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Attendance Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">Best Attendance</p>
              <p className="text-xl font-bold">Computer Science: 94%</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">Most Improved</p>
              <p className="text-xl font-bold">Electrical: +8%</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">Needs Attention</p>
              <p className="text-xl font-bold">Civil: 72%</p>
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Attendance trend chart would be displayed here</p>
          </div>
        </motion.div>
      )}

      {selectedReport === 'financial' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Financial Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-2">Fee Collection by Department</h3>
              <div className="space-y-2">
                {[
                  { department: 'Computer Science', collected: 95, pending: 5 },
                  { department: 'Electrical', collected: 88, pending: 12 },
                  { department: 'Mechanical', collected: 92, pending: 8 },
                  { department: 'Civil', collected: 85, pending: 15 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.department}</span>
                      <span className="text-sm font-medium">{item.collected}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${item.collected}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Revenue Sources</h3>
              <div className="space-y-2">
                {[
                  { source: 'Tuition Fees', amount: '$1.2M', percentage: 65 },
                  { source: 'Government Grants', amount: '$450K', percentage: 25 },
                  { source: 'Donations', amount: '$180K', percentage: 10 },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.source}</span>
                      <span className="text-sm font-medium">{item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {selectedReport === 'workload' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Faculty Workload Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Teaching Hours by Department</h3>
              <div className="space-y-3">
                {[
                  { department: 'Computer Science', hours: 22, trend: 'up' },
                  { department: 'Electrical', hours: 18, trend: 'down' },
                  { department: 'Mechanical', hours: 20, trend: 'stable' },
                  { department: 'Civil', hours: 16, trend: 'up' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{item.department}</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{item.hours}h</span>
                      <span className={`text-sm ${
                        item.trend === 'up' ? 'text-green-600' : 
                        item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Workload Balance</h3>
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Workload distribution chart would be displayed here</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsReports;
