import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiBell, FiAlertTriangle, FiEdit, FiTrash, FiSend, FiXCircle } from 'react-icons/fi';

interface Notice {
  id: number;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Event' | 'Emergency';
  date: string;
  priority: 'High' | 'Medium' | 'Low';
}

const NoticeBoard: React.FC = () => {
  const [notices] = useState<Notice[]>([
    { id: 1, title: 'Semester End Exams Schedule', content: 'The schedule for semester end exams has been published. Please check the student portal.', category: 'Academic', date: '2023-07-10', priority: 'High' },
    { id: 2, title: 'College Annual Day', content: 'The annual day celebration will be held on July 25th. All students are invited.', category: 'Event', date: '2023-07-05', priority: 'Medium' },
    { id: 3, title: 'Library Closure', content: 'The library will be closed for maintenance on July 15th.', category: 'General', date: '2023-07-03', priority: 'Low' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'General' as Notice['category'],
    priority: 'Medium' as Notice['priority'],
  });

  const [emergencyAlert, setEmergencyAlert] = useState(false);

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-blue-100 text-blue-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${priorityClasses[priority as keyof typeof priorityClasses]}`}>
        {priority}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryClasses = {
      General: 'bg-gray-100 text-gray-800',
      Academic: 'bg-purple-100 text-purple-800',
      Event: 'bg-green-100 text-green-800',
      Emergency: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${categoryClasses[category as keyof typeof categoryClasses]}`}>
        {category}
      </span>
    );
  };

  const handleCreateNotice = () => {
    // In a real app, this would send data to an API
    setIsModalOpen(false);
    setNewNotice({ title: '', content: '', category: 'General', priority: 'Medium' });
  };

  const triggerEmergencyAlert = () => {
    setEmergencyAlert(true);
    // In a real app, this would trigger SMS/email notifications
    setTimeout(() => setEmergencyAlert(false), 5000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notice Board & Communication</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiPlus className="mr-2" /> Create Notice
          </button>
          <button 
            onClick={triggerEmergencyAlert}
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiAlertTriangle className="mr-2" /> Emergency Alert
          </button>
        </div>
      </div>

      <AnimatePresence>
        {emergencyAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-red-500 text-white p-4 rounded-lg mb-6 flex justify-between items-center"
          >
            <div className="flex items-center">
              <FiAlertTriangle className="mr-2" />
              <span>Emergency alert sent to all students and faculty!</span>
            </div>
            <button onClick={() => setEmergencyAlert(false)} className="text-white">
              <FiXCircle />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notices</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <FiBell className="w-8 h-8 text-primary-500" />
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
              <p className="text-sm text-gray-600">Active Notices</p>
              <p className="text-2xl font-bold">28</p>
            </div>
            <FiBell className="w-8 h-8 text-green-500" />
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
              <p className="text-sm text-gray-600">Emergency Alerts</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <FiAlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Notices</h2>
          </div>
          <div className="divide-y">
            {notices.map((notice) => (
              <div key={notice.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{notice.title}</h3>
                  <div className="flex space-x-2">
                    {getCategoryBadge(notice.category)}
                    {getPriorityBadge(notice.priority)}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{notice.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{notice.date}</span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <FiEdit />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <FiTrash />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                      <FiSend />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Notice Statistics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Academic Notices</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Event Notices</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">General Notices</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Emergency Alerts</span>
                <span className="text-sm font-medium">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Notice Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Create New Notice</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={newNotice.content}
                    onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newNotice.category}
                      onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as Notice['category'] })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="General">General</option>
                      <option value="Academic">Academic</option>
                      <option value="Event">Event</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={newNotice.priority}
                      onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value as Notice['priority'] })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNotice}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                  >
                    Create Notice
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoticeBoard;
