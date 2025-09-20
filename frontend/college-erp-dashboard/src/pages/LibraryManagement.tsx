import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiPlus, FiSearch, FiFilter, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'Available' | 'Issued' | 'Reserved';
  dueDate?: string;
}

const LibraryManagement: React.FC = () => {
  const [books] = useState<Book[]>([
    { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', status: 'Available' },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Software Engineering', status: 'Issued', dueDate: '2023-07-20' },
    { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0201616224', category: 'Software Engineering', status: 'Reserved' },
  ]);

  const [issuedBooks] = useState([
    { id: 1, student: 'John Doe', book: 'Introduction to Algorithms', issuedDate: '2023-06-15', dueDate: '2023-07-15', status: 'Overdue' },
    { id: 2, student: 'Jane Smith', book: 'Clean Code', issuedDate: '2023-07-01', dueDate: '2023-07-20', status: 'Issued' },
    { id: 3, student: 'Robert Johnson', book: 'The C Programming Language', issuedDate: '2023-07-05', dueDate: '2023-07-25', status: 'Issued' },
  ]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Available: 'bg-green-100 text-green-800',
      Issued: 'bg-blue-100 text-blue-800',
      Reserved: 'bg-yellow-100 text-yellow-800',
      Overdue: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Library Management</h1>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center">
          <FiPlus className="mr-2" /> Add Book
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
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold">5,236</p>
            </div>
            <FiBook className="w-8 h-8 text-primary-500" />
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
              <p className="text-sm text-gray-600">Books Issued</p>
              <p className="text-2xl font-bold">1,842</p>
            </div>
            <FiBook className="w-8 h-8 text-blue-500" />
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
              <p className="text-sm text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold">127</p>
            </div>
            <FiClock className="w-8 h-8 text-red-500" />
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
              <p className="text-sm text-gray-600">New Arrivals</p>
              <p className="text-2xl font-bold">48</p>
            </div>
            <FiBook className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Book Inventory</h2>
            <div className="flex space-x-2">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search books..."
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
                  <th className="p-4">Title</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{book.title}</td>
                    <td className="p-4">{book.author}</td>
                    <td className="p-4">{book.category}</td>
                    <td className="p-4">{getStatusBadge(book.status)}</td>
                    <td className="p-4 flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        View
                      </button>
                      <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded">
                        Edit
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
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Issued Books</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-4">Student</th>
                  <th className="p-4">Book</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((issue) => (
                  <tr key={issue.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{issue.student}</td>
                    <td className="p-4">{issue.book}</td>
                    <td className="p-4">{issue.dueDate}</td>
                    <td className="p-4">{getStatusBadge(issue.status)}</td>
                    <td className="p-4 flex space-x-2">
                      {issue.status === 'Overdue' && (
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <FiXCircle />
                        </button>
                      )}
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded">
                        <FiCheckCircle />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Overdue Alerts</h2>
        <div className="space-y-3">
          {issuedBooks.filter(b => b.status === 'Overdue').map((book) => (
            <div key={book.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium">{book.book}</p>
                <p className="text-sm text-red-600">Overdue by 5 days - {book.student}</p>
              </div>
              <button className="text-red-700 font-medium">Send Reminder</button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LibraryManagement;
