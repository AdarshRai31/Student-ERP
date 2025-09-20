// ...existing code...
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiMessageSquare, FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';

interface Ticket {
  id: number;
  title: string;
  requester: string;
  department: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
  assignedTo: string;
}

const HelpdeskSupport: React.FC = () => {
  const [tickets] = useState<Ticket[]>([
    { id: 1, title: 'Login issues', requester: 'John Doe', department: 'Student', status: 'Open', priority: 'High', date: '2023-07-10', assignedTo: 'Unassigned' },
    { id: 2, title: 'Course material access', requester: 'Jane Smith', department: 'Student', status: 'In Progress', priority: 'Medium', date: '2023-07-09', assignedTo: 'IT Support' },
    { id: 3, title: 'Grade discrepancy', requester: 'Robert Johnson', department: 'Faculty', status: 'Resolved', priority: 'High', date: '2023-07-05', assignedTo: 'Academic Office' },
    { id: 4, title: 'Library book renewal', requester: 'Sarah Williams', department: 'Student', status: 'Open', priority: 'Low', date: '2023-07-08', assignedTo: 'Unassigned' },
  ]);

  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'progress' | 'resolved'>('all');

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Open: 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      Resolved: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {priority}
      </span>
    );
  };

  const filteredTickets = tickets.filter(ticket => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'open') return ticket.status === 'Open';
    if (selectedStatus === 'progress') return ticket.status === 'In Progress';
    if (selectedStatus === 'resolved') return ticket.status === 'Resolved';
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Helpdesk Support</h1>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center">
          <FiPlus className="mr-2" /> New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold">142</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-primary-500" />
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
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-yellow-500" />
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
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold">35</p>
            </div>
            <FiClock className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold">65</p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${selectedStatus === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setSelectedStatus('all')}
        >
          All Tickets
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${selectedStatus === 'open' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setSelectedStatus('open')}
        >
          Open
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${selectedStatus === 'progress' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setSelectedStatus('progress')}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${selectedStatus === 'resolved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setSelectedStatus('resolved')}
        >
          Resolved
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Support Tickets</h2>
          <div className="flex space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="bg-transparent outline-none"
              />
            </div>
            <button className="border border-gray-300 px-3 py-2 rounded-lg">
              <FiFilter />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Requester</th>
                <th className="p-4">Department</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono">#{ticket.id}</td>
                  <td className="p-4 font-medium">{ticket.title}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                        <FiUser className="text-primary-600 text-xs" />
                      </div>
                      {ticket.requester}
                    </div>
                  </td>
                  <td className="p-4">{ticket.department}</td>
                  <td className="p-4">{getPriorityBadge(ticket.priority)}</td>
                  <td className="p-4">{getStatusBadge(ticket.status)}</td>
                  <td className="p-4">{ticket.assignedTo}</td>
                  <td className="p-4">
                    <button className="text-primary-600 hover:text-primary-800 text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Ticket Statistics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Student Tickets</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Faculty Tickets</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Staff Tickets</span>
                <span className="text-sm font-medium">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Response Time</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="text-sm font-medium">2.4 hours</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Satisfaction Rate</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpdeskSupport;
// ...existing code...