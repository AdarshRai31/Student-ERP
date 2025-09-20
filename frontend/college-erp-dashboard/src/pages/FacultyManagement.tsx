import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash, FiSearch, FiFilter, FiUser, FiMail, FiBook, FiAward } from 'react-icons/fi';

interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  status: 'Active' | 'On Leave';
  avatar: string;
  joinDate: string;
}

const FacultyManagement: React.FC = () => {
  const [faculty] = useState<Faculty[]>([
    { id: 1, name: 'Dr. Robert Smith', email: 'robert@example.com', department: 'Computer Science', subjects: ['Algorithms', 'Data Structures'], status: 'Active', avatar: 'RS', joinDate: '2020-03-15' },
    { id: 2, name: 'Prof. Sarah Johnson', email: 'sarah@example.com', department: 'Mathematics', subjects: ['Calculus', 'Linear Algebra'], status: 'Active', avatar: 'SJ', joinDate: '2018-06-10' },
    { id: 3, name: 'Dr. Michael Brown', email: 'michael@example.com', department: 'Physics', subjects: ['Quantum Mechanics', 'Thermodynamics'], status: 'On Leave', avatar: 'MB', joinDate: '2019-01-22' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const filteredFaculty = faculty.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const openEditModal = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Faculty Management</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus className="mr-2" /> Add Faculty
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Faculty</p>
              <p className="text-2xl font-bold">143</p>
              <p className="text-sm text-green-600">+5% from last year</p>
            </div>
            <FiUser className="w-8 h-8 text-primary-500" />
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
              <p className="text-sm text-gray-600">Professors</p>
              <p className="text-2xl font-bold">67</p>
              <p className="text-sm text-green-600">+3% from last year</p>
            </div>
            <FiAward className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Associate Professors</p>
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-green-600">+7% from last year</p>
            </div>
            <FiAward className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-red-600">+2% from last year</p>
            </div>
            <FiUser className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-auto">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search faculty..."
              className="bg-transparent outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button className="border border-gray-300 px-3 py-2 rounded-lg text-sm flex items-center">
              <FiFilter className="mr-1" /> More Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-4">Faculty</th>
                <th className="p-4">Email</th>
                <th className="p-4">Department</th>
                <th className="p-4">Subjects</th>
                <th className="p-4">Join Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-medium">{member.avatar}</span>
                      </div>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-2" />
                      {member.email}
                    </div>
                  </td>
                  <td className="p-4">{member.department}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {member.subjects.map((subject, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">{member.joinDate}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => openEditModal(member)}
                    >
                      <FiEdit />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Faculty Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">
                {selectedFaculty ? 'Edit Faculty' : 'Add New Faculty'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={selectedFaculty?.name || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={selectedFaculty?.email || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    defaultValue={selectedFaculty?.department || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                  <input
                    type="text"
                    defaultValue={selectedFaculty?.subjects.join(', ') || ''}
                    placeholder="Separate subjects with commas"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    defaultValue={selectedFaculty?.status || 'Active'}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                  >
                    {selectedFaculty ? 'Update' : 'Create'} Faculty
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyManagement;
