// src/components/ClassManagement/TimetableUpload.tsx
import React, { useState } from 'react';
import { Upload, Download, Trash2, Calendar, Plus } from 'lucide-react';
import './TimetableUpload.css';

interface TimetableEntry {
  id: string;
  subject: string;
  section: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

const TimetableUpload: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([
    {
      id: '1',
      subject: 'Data Structures',
      section: 'CS-A',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      room: 'Room 101'
    },
    {
      id: '2',
      subject: 'Algorithms',
      section: 'CS-B',
      day: 'Tuesday',
      startTime: '11:00',
      endTime: '12:30',
      room: 'Room 202'
    },
  ]);

  const [newEntry, setNewEntry] = useState<Omit<TimetableEntry, 'id'>>({
    subject: '',
    section: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    room: ''
  });

  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (field: keyof typeof newEntry, value: string) => {
    setNewEntry({ ...newEntry, [field]: value });
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...newEntry,
      id: Date.now().toString()
    };
    setTimetable([...timetable, newItem]);
    setNewEntry({
      subject: '',
      section: '',
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      room: ''
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setTimetable(timetable.filter(item => item.id !== id));
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="timetable-upload">
      <div className="page-header">
        <h2>Timetable Management</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          <span>Add Class</span>
        </button>
      </div>

      {showForm && (
        <div className="timetable-form">
          <h3>Add New Class</h3>
          <form onSubmit={handleAddEntry}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={newEntry.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="section">Section</label>
                <select
                  id="section"
                  value={newEntry.section}
                  onChange={(e) => handleInputChange('section', e.target.value)}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="CS-A">CS-A</option>
                  <option value="CS-B">CS-B</option>
                  <option value="CS-C">CS-C</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="day">Day</label>
                <select
                  id="day"
                  value={newEntry.day}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  required
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="room">Room</label>
                <input
                  type="text"
                  id="room"
                  value={newEntry.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  value={newEntry.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  value={newEntry.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Add to Timetable</button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="timetable-content">
        <div className="upload-section">
          <h3>Upload Timetable File</h3>
          <div className="file-upload-container">
            <div className="file-upload">
              <input type="file" id="timetable-file" accept=".xlsx,.xls,.csv" />
              <label htmlFor="timetable-file" className="file-label">
                <Upload size={20} />
                <span>Choose Excel/CSV File</span>
              </label>
            </div>
            <button className="btn-secondary">
              <Download size={16} />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        <div className="timetable-list">
          <h3>Current Timetable</h3>
          {timetable.length === 0 ? (
            <p className="no-data">No classes scheduled yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Section</th>
                    <th>Room</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.day}</td>
                      <td>{entry.startTime} - {entry.endTime}</td>
                      <td>{entry.subject}</td>
                      <td>{entry.section}</td>
                      <td>{entry.room}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn" title="Edit">
                            <Calendar size={16} />
                          </button>
                          <button 
                            className="icon-btn delete" 
                            title="Delete"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableUpload;
