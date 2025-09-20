import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiSearch,
  FiFilter,
  FiBook,
  FiUser,
  FiBarChart,
} from 'react-icons/fi';

interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  credits: number;
  faculty: string;
  enrolled: number;
  capacity: number;
}

const CourseManagement: React.FC = () => {
  const [courses] = useState<Course[]>([
    {
      id: 1,
      code: 'CS101',
      name: 'Introduction to Programming',
      department: 'Computer Science',
      credits: 4,
      faculty: 'Dr. Robert Smith',
      enrolled: 45,
      capacity: 50,
    },
    {
      id: 2,
      code: 'MATH201',
      name: 'Advanced Calculus',
      department: 'Mathematics',
      credits: 3,
      faculty: 'Prof. Sarah Johnson',
      enrolled: 38,
      capacity: 40,
    },
    {
      id: 3,
      code: 'PHYS301',
      name: 'Quantum Mechanics',
      department: 'Physics',
      credits: 4,
      faculty: 'Dr. Michael Brown',
      enrolled: 28,
      capacity: 30,
    },
    {
      id: 4,
      code: 'CHEM202',
      name: 'Organic Chemistry',
      department: 'Chemistry',
      credits: 3,
      faculty: 'Dr. Emily Davis',
      enrolled: 32,
      capacity: 35,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'All' || course.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const getEnrollmentStatus = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus className="mr-2" /> Add Course
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold">42</p>
              <p className="text-sm text-green-600">+8% from last semester</p>
            </div>
            <FiBook className="w-8 h-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">Average Enrollment</p>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-green-600">+5% from last semester</p>
            </div>
            <FiBarChart className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600">Full Courses</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-red-600">+2 from last semester</p>
            </div>
            <FiBook className="w-8 h-8 text-red-500" />
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
              <p className="text-sm text-gray-600">New Courses</p>
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-green-600">+3 from last semester</p>
            </div>
            <FiBook className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Course Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-auto">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search courses..."
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
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
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
                <th className="p-4">Code</th>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Faculty</th>
                <th className="p-4">Enrollment</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <motion.tr
                  key={course.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-mono">{course.code}</td>
                  <td className="p-4 font-medium">{course.name}</td>
                  <td className="p-4">{course.department}</td>
                  <td className="p-4">{course.credits}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <FiUser className="text-gray-400 mr-2" />
                      {course.faculty}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">
                        {course.enrolled}/{course.capacity}
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round((course.enrolled / course.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getEnrollmentStatus(course.enrolled, course.capacity)}`}
                        style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => openEditModal(course)}
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

      {/* Add/Edit Modal */}
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
                {selectedCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    defaultValue={selectedCourse?.code || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                  <input
                    type="text"
                    defaultValue={selectedCourse?.name || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    defaultValue={selectedCourse?.department || ''}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                  <input
                    type="number"
                    defaultValue={selectedCourse?.credits || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                  <select
                    defaultValue={selectedCourse?.faculty || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Faculty</option>
                    <option value="Dr. Robert Smith">Dr. Robert Smith</option>
                    <option value="Prof. Sarah Johnson">Prof. Sarah Johnson</option>
                    <option value="Dr. Michael Brown">Dr. Michael Brown</option>
                    <option value="Dr. Emily Davis">Dr. Emily Davis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    defaultValue={selectedCourse?.capacity || ''}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    {selectedCourse ? 'Update' : 'Create'} Course
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

export default CourseManagement;
