import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiXCircle, FiDownload, FiFilter } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { date: '2023-01', attendance: 85 },
  { date: '2023-02', attendance: 92 },
  { date: '2023-03', attendance: 78 },
  { date: '2023-04', attendance: 95 },
  { date: '2023-05', attendance: 88 },
  { date: '2023-06', attendance: 91 },
];

const examSchedule = [
  { id: 1, subject: 'Mathematics', date: '2023-07-15', time: '9:00 AM', status: 'Approved' },
  { id: 2, subject: 'Physics', date: '2023-07-17', time: '2:00 PM', status: 'Pending' },
  { id: 3, subject: 'Chemistry', date: '2023-07-19', time: '9:00 AM', status: 'Pending' },
];

const AttendanceExams: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'attendance' | 'exams'>('attendance');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance & Exams</h1>
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${selectedTab === 'attendance' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('attendance')}
        >
          Attendance
        </button>
        <button
          className={`px-4 py-2 font-medium ${selectedTab === 'exams' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setSelectedTab('exams')}
        >
          Exam Schedules
        </button>
      </div>

      {selectedTab === 'attendance' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Attendance Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-4">Attendance Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Overall Attendance</span>
                  <span className="font-semibold">88%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">91%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lowest Attendance</span>
                  <span className="font-semibold text-red-600">78% (March)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Students at Risk</span>
                  <span className="font-semibold">12</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Attendance Records</h2>
              <div className="flex space-x-2">
                <button className="border border-gray-300 px-3 py-1 rounded-lg flex items-center text-sm">
                  <FiFilter className="mr-1" /> Filter
                </button>
                <button className="border border-gray-300 px-3 py-1 rounded-lg flex items-center text-sm">
                  <FiDownload className="mr-1" /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-4">Date</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Present</th>
                    <th className="p-4">Absent</th>
                    <th className="p-4">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2023-06-15', subject: 'Mathematics', present: 45, absent: 5, percentage: 90 },
                    { date: '2023-06-16', subject: 'Physics', present: 42, absent: 8, percentage: 84 },
                    { date: '2023-06-17', subject: 'Chemistry', present: 47, absent: 3, percentage: 94 },
                  ].map((record, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4">{record.date}</td>
                      <td className="p-4">{record.subject}</td>
                      <td className="p-4">{record.present}</td>
                      <td className="p-4">{record.absent}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.percentage >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : record.percentage >= 75 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Exam Schedules</h2>
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center">
                <FiCalendar className="mr-2" /> Create Schedule
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="p-4">Subject</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {examSchedule.map((exam) => (
                    <tr key={exam.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{exam.subject}</td>
                      <td className="p-4">{exam.date}</td>
                      <td className="p-4">{exam.time}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          exam.status === 'Approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="p-4 flex space-x-2">
                        {exam.status === 'Pending' && (
                          <>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                              <FiCheckCircle />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                              <FiXCircle />
                            </button>
                          </>
                        )}
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <FiDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Hall Ticket Generation</h2>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Generate hall tickets for upcoming exams</p>
                <p className="text-sm text-gray-600">Hall tickets will include student details and exam information</p>
              </div>
              <button className="mt-4 sm:mt-0 bg-primary-500 text-white px-4 py-2 rounded-lg">
                Generate All Hall Tickets
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AttendanceExams;
