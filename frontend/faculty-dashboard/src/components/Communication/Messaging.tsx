// src/components/Communication/Messaging.tsx
import React, { useState } from 'react';
import { Send, Search, User, Paperclip } from 'lucide-react';
import './Messaging.css';

const Messaging: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [students] = useState([
    { id: 'S001', name: 'John Doe', unread: 3 },
    { id: 'S002', name: 'Jane Smith', unread: 0 },
    { id: 'S003', name: 'Robert Johnson', unread: 1 },
    { id: 'S004', name: 'Emily Davis', unread: 0 },
  ]);

  const [messages, setMessages] = useState<Record<string, Array<{
    id: string;
    content: string;
    sender: 'faculty' | 'student';
    timestamp: string;
  }>>>({
    S001: [
      { id: '1', content: 'Hello Professor, I have a question about the assignment.', sender: 'student', timestamp: '2023-10-15 14:30' },
      { id: '2', content: 'Sure, what would you like to know?', sender: 'faculty', timestamp: '2023-10-15 14:35' },
      { id: '3', content: 'I\'m confused about question 3 in the problem set.', sender: 'student', timestamp: '2023-10-15 14:40' },
    ],
    S002: [
      { id: '1', content: 'Thank you for the feedback on my assignment!', sender: 'student', timestamp: '2023-10-14 10:15' },
      { id: '2', content: 'You\'re welcome! You did a great job.', sender: 'faculty', timestamp: '2023-10-14 10:20' },
    ],
    S003: [
      { id: '1', content: 'When are your office hours this week?', sender: 'student', timestamp: '2023-10-13 16:45' },
    ],
    S004: [],
  });

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!selectedStudent || !newMessage.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'faculty' as const,
      timestamp: new Date().toLocaleString(),
    };

    setMessages({
      ...messages,
      [selectedStudent]: [...(messages[selectedStudent] || []), newMsg],
    });

    setNewMessage('');
  };

  return (
    <div className="messaging">
      <div className="page-header">
        <h2>Student Messaging</h2>
      </div>

      <div className="messaging-container">
        <div className="students-list">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="students">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`student-item ${selectedStudent === student.id ? 'selected' : ''}`}
                onClick={() => setSelectedStudent(student.id)}
              >
                <div className="student-avatar">
                  <User size={20} />
                </div>
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p>{student.id}</p>
                </div>
                {student.unread > 0 && (
                  <div className="unread-badge">{student.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="message-container">
          {selectedStudent ? (
            <>
              <div className="message-header">
                <div className="student-info">
                  <div className="student-avatar">
                    <User size={24} />
                  </div>
                  <div>
                    <h4>{students.find(s => s.id === selectedStudent)?.name}</h4>
                    <p>{selectedStudent}</p>
                  </div>
                </div>
              </div>

              <div className="messages">
                {(messages[selectedStudent] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'faculty' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="timestamp">{message.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <div className="input-container">
                  <button className="attach-btn">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <h3>Select a student to start messaging</h3>
              <p>Choose a student from the list to view and send messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
