import React, { useState } from 'react';
import './MeetingSchedule.css';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  duration: number;
  participants: string[];
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  description: string;
}

interface MeetingScheduleProps {
  meetings: Meeting[];
}

export const MeetingSchedule: React.FC<MeetingScheduleProps> = ({ meetings }) => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const upcomingMeetings = meetings
    .filter(meeting => meeting.status === 'scheduled')
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const pastMeetings = meetings
    .filter(meeting => meeting.status !== 'scheduled')
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="meeting-schedule">
      <h3>Parent-Teacher Meetings</h3>
      
      <div className="meetings-tabs">
        <button className="tab active">Upcoming ({upcomingMeetings.length})</button>
        <button className="tab">Past ({pastMeetings.length})</button>
      </div>
      
      <div className="meetings-list">
        {upcomingMeetings.map(meeting => (
          <div 
            key={meeting.id} 
            className="meeting-card"
            onClick={() => setSelectedMeeting(meeting)}
          >
            <div className="meeting-date">
              <div className="date-day">{meeting.date.getDate()}</div>
              <div className="date-month">{meeting.date.toLocaleString('default', { month: 'short' })}</div>
            </div>
            <div className="meeting-details">
              <h4>{meeting.title}</h4>
              <p className="meeting-time">
                {meeting.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                {meeting.duration} mins • {meeting.location}
              </p>
              <div className="participants">
                {meeting.participants.map((participant, index) => (
                  <span key={index} className="participant-tag">{participant}</span>
                ))}
              </div>
            </div>
            <div className="meeting-actions">
              <button className="join-btn">Join</button>
              <button className="details-btn">Details</button>
            </div>
          </div>
        ))}
        
        {upcomingMeetings.length === 0 && (
          <div className="no-meetings">
            No upcoming meetings scheduled
          </div>
        )}
      </div>
      
      {selectedMeeting && (
        <div className="meeting-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedMeeting(null)}>×</button>
            <h3>{selectedMeeting.title}</h3>
            <div className="modal-details">
              <p><strong>Date:</strong> {selectedMeeting.date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedMeeting.date.toLocaleTimeString()}</p>
              <p><strong>Duration:</strong> {selectedMeeting.duration} minutes</p>
              <p><strong>Location:</strong> {selectedMeeting.location}</p>
              <p><strong>Participants:</strong> {selectedMeeting.participants.join(', ')}</p>
              <p><strong>Description:</strong> {selectedMeeting.description}</p>
            </div>
            <div className="modal-actions">
              <button className="add-calendar-btn">Add to Calendar</button>
              <button className="reminder-btn">Set Reminder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
