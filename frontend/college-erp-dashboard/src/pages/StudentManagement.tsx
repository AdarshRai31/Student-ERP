import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit,
  FiTrash,
  FiSearch,
  FiFilter,
  FiUser,
  FiMail,
  FiBook,
  FiActivity,
} from 'react-icons/fi';
import { fetchJSON } from '../utils/api';

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Probation';
  avatar: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formName, setFormName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formCourse, setFormCourse] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive' | 'Probation'>('Active');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Probation'>(
    'All'
  );

  async function loadStudents(targetPage: number, targetPageSize: number) {
    setLoading(true);
    try {
      type StudentsListResponse = { success: boolean; data: Array<{ name: string; email: string; course: string; status: string }>; count?: number; total?: number; page?: number; pageSize?: number };
      const res = await fetchJSON<StudentsListResponse>(`/public/students?page=${targetPage}&pageSize=${targetPageSize}`);
      const now = Date.now();
      const mapped: Student[] = (res.data || []).map((s, idx) => ({
        id: now + idx,
        name: s.name || s.email?.split('@')[0] || `Student ${idx+1}`,
        email: s.email || '',
        course: s.course || '-',
        enrollmentDate: '-',
        status: (s.status as any) || 'Active',
        avatar: (s.name || s.email || '?').split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase(),
      }));
      setStudents(mapped);
      setTotal(res.total || mapped.length);
      setPage(res.page || targetPage);
      setPageSize(res.pageSize || targetPageSize);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-red-100 text-red-800',
      Probation: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          statusClasses[status as keyof typeof statusClasses]
        }`}
      >
        {status}
      </span>
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  function openAddModal() {
    setSelectedStudent(null);
    setFormName('');
    setFormEmail('');
    setFormCourse('');
    setFormStatus('Active');
    setIsModalOpen(true);
  }

  function openEditModal(student: Student) {
    setSelectedStudent(student);
    setFormName(student.name || '');
    setFormEmail(student.email || '');
    setFormCourse(student.course || '');
    setFormStatus(student.status);
    setIsModalOpen(true);
  }

  async function submitForm() {
    try {
      setLoading(true);
      if (selectedStudent) {
        // Update existing
        await fetchJSON('/public/students', {
          method: 'PUT',
          body: JSON.stringify({ email: formEmail, name: formName, course: formCourse, status: formStatus }),
        } as any);
      } else {
        // Create new
        await fetchJSON('/public/students', {
          method: 'POST',
          body: JSON.stringify({ email: formEmail, name: formName, course: formCourse, status: formStatus }),
        } as any);
      }
      setIsModalOpen(false);
      await loadStudents(page, pageSize);
    } catch (e) {
      setError((e as any)?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={openAddModal}
        >
          <FiPlus className="mr-2" /> Add Student
        </motion.button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      {loading && (
        <div className="mb-4 text-sm text-gray-600">Loading students...</div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold">2,456</p>
              <p className="text-sm text-green-600">+12% from last year</p>
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
              <p className="text-sm text-gray-600">Active Students</p>
              <p className="text-2xl font-bold">2,120</p>
              <p className="text-sm text-green-600">+8% from last year</p>
            </div>
            <FiActivity className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600">New Enrollments</p>
              <p className="text-2xl font-bold">342</p>
              <p className="text-sm text-green-600">+15% from last year</p>
            </div>
            <FiUser className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">On Probation</p>
              <p className="text-2xl font-bold">86</p>
              <p className="text-sm text-red-600">-5% from last year</p>
            </div>
            <FiUser className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Student Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm"
      >
        {/* Search + Filter + Pagination Controls */}
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-auto">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search students..."
              className="bg-transparent outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
              title="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Probation">Probation</option>
            </select>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Page size:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                title="Select page size"
                value={pageSize}
                onChange={(e) => {
                  const ps = parseInt(e.target.value, 10) || 10;
                  setPage(1);
                  setPageSize(ps);
                  loadStudents(1, ps);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-4">Student</th>
                <th className="p-4">Email</th>
                <th className="p-4">Course</th>
                <th className="p-4">Enrollment Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-medium">{student.avatar}</span>
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-2" />
                      {student.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <FiBook className="text-gray-400 mr-2" />
                      {student.course}
                    </div>
                  </td>
                  <td className="p-4">{student.enrollmentDate}</td>
                  <td className="p-4">{getStatusBadge(student.status)}</td>
                  <td className="p-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => openEditModal(student)}
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

        {/* Pagination footer */}
        <div className="p-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm text-gray-600">
            {(() => {
              const start = (page - 1) * pageSize + 1;
              const end = Math.min(page * pageSize, total);
              return `Showing ${Math.min(start, total)}–${Math.max(start <= end ? end : total, 0)} of ${total}`;
            })()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-2 border border-gray-300 rounded text-sm"
              onClick={() => { if (page > 1) loadStudents(page - 1, pageSize); }}
              disabled={page <= 1 || loading}
              title="Previous page"
            >
              Prev
            </button>
            <span className="text-sm">Page {page}</span>
            <button
              className="px-3 py-2 border border-gray-300 rounded text-sm"
              onClick={() => { if (page * pageSize < total) loadStudents(page + 1, pageSize); }}
              disabled={(page * pageSize) >= total || loading}
              title="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Student Modal */}
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
              <h2 className="text-xl font-bold mb-4">{selectedStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sm-name">Full Name</label>
                  <input
                    id="sm-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sm-email">Email</label>
                  <input
                    id="sm-email"
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="name@college.edu"
                    disabled={!!selectedStudent}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sm-course">Course</label>
                  <select
                    id="sm-course"
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Course</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="sm-status">Status</label>
                  <select
                    id="sm-status"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Probation">Probation</option>
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
                    onClick={submitForm}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                  >
                    {selectedStudent ? 'Update' : 'Create'} Student
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

export default StudentManagement;
