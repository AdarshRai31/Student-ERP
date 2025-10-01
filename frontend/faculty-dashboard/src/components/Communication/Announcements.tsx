// src/components/Communication/Announcements.tsx
import React, { useState } from 'react';
import { Plus, Bell, Edit, Trash2 } from 'lucide-react';
import './Announcements.css';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: '1',
      title: 'Midterm Exam Schedule',
      content: 'The midterm exams will be held from November 15-20. Please check the schedule on the notice board.',
      date: '2023-10-15',
      subject: 'All Subjects',
      section: 'All Sections',
    },
    {
      id: '2',
      title: 'Data Structures Assignment Deadline',
      content: 'Reminder: Assignment 2 is due this Friday by 5 PM. Late submissions will not be accepted.',
      date: '2023-10-10',
      subject: 'Data Structures',
      section: 'CS-A',
    },
    {
      id: '3',
      title: 'Lab Session Cancelled',
      content: 'This week\'s lab session is cancelled due to the faculty meeting. It will be rescheduled next week.',
      date: '2023-10-05',
      subject: 'Algorithms',
      section: 'CS-B',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    subject: '',
    section: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.content) {
      const newItem = {
        ...newAnnouncement,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
      };
      setAnnouncements([newItem, ...announcements]);
      setNewAnnouncement({ title: '', content: '', subject: '', section: '' });
      setShowForm(false);
    }
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <div className="announcements">
      <div className="page-header">
        <h2>Announcements</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          <span>New Announcement</span>
        </button>
      </div>

      {showForm && (
        <div className="announcement-form-container">
          <h3>Create New Announcement</h3>
          <form onSubmit={handleSubmit} className="announcement-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={newAnnouncement.subject}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, subject: e.target.value })}
                >
                  <option value="">All Subjects</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Database Systems">Database Systems</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="section">Section</label>
                <select
                  id="section"
                  value={newAnnouncement.section}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, section: e.target.value })}
                >
                  <option value="">All Sections</option>
                  <option value="CS-A">CS-A</option>
                  <option value="CS-B">CS-B</option>
                  <option value="CS-C">CS-C</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Enter announcement content"
                rows={4}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Publish Announcement</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="announcements-list">
        <h3>Recent Announcements</h3>
        {announcements.length === 0 ? (
          <p className="no-data">No announcements yet.</p>
        ) : (
          <div className="announcements-grid">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="announcement-card">
                <div className="announcement-header">
                  <div className="announcement-title">
                    <Bell size={18} />
                    <h4>{announcement.title}</h4>
                  </div>
                  <div className="announcement-meta">
                    <span className="date">{new Date(announcement.date).toLocaleDateString()}</span>
                    <span className="subject">{announcement.subject}</span>
                    <span className="section">{announcement.section}</span>
                  </div>
                </div>
                
                <div className="announcement-content">
                  <p>{announcement.content}</p>
                </div>
                
                <div className="announcement-actions">
                  <button className="icon-btn" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button 
                    className="icon-btn delete" 
                    title="Delete"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
