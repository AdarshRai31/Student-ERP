import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiDownload, FiFilter } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const feeData = [
  { name: 'Paid', value: 75, color: '#12a90ce3' },
  { name: 'Pending', value: 20, color: '#d38807ff' },
  { name: 'Overdue', value: 5, color: '#ab0b0bff' },
];

interface Fee {
  id: number;
  student: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

const FinanceManagement: React.FC = () => {
  const [fees] = useState<Fee[]>([
    { id: 1, student: 'John Doe', amount: 1200, dueDate: '2023-06-15', status: 'Paid' },
    { id: 2, student: 'Jane Smith', amount: 1200, dueDate: '2023-06-15', status: 'Pending' },
    { id: 3, student: 'Robert Johnson', amount: 1200, dueDate: '2023-05-30', status: 'Overdue' },
  ]);

  const getStatusBadge = (status: Fee['status']) => {
    const statusClasses = {
      Paid: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Overdue: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Finance Management</h1>
        <div className="flex space-x-2">
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center">
            <FiFilter className="mr-2" /> Filter
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg flex items-center">
            <FiDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold">$45,200</p>
              <p className="text-sm text-green-600">+23% from last month</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600">Pending Fees</p>
              <p className="text-2xl font-bold">$12,400</p>
              <p className="text-sm text-yellow-600">-2% from last month</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-yellow-500" />
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
              <p className="text-sm text-gray-600">Overdue Fees</p>
              <p className="text-2xl font-bold">$3,200</p>
              <p className="text-sm text-red-600">+5% from last month</p>
            </div>
            <FiDollarSign className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Fee Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
            data={feeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={(props: { name?: string; percent?: number }) =>
                `${props.name}: ${props.percent !== undefined ? (props.percent * 100).toFixed(0) : 0}%`
            }
            >
            {feeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {fees.map((fee, index) => (
              <motion.div
                key={fee.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border-b"
              >
                <div>
                  <p className="font-medium">{fee.student}</p>
                  <p className="text-sm text-gray-500">Due: {fee.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${fee.amount}</p>
                  {getStatusBadge(fee.status)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Fee Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-4">Student</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{fee.student}</td>
                  <td className="p-4">${fee.amount}</td>
                  <td className="p-4">{fee.dueDate}</td>
                  <td className="p-4">{getStatusBadge(fee.status)}</td>
                  <td className="p-4">
                    <button className="text-primary-600 hover:text-primary-800">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;