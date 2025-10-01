import React, { useState } from 'react';
import './AttendanceCalendar.css';

interface AttendanceDay {
  date: Date;
  status: 'present' | 'absent' | 'half-day' | 'holiday';
}

export const AttendanceCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysInMonth = new Date(
    currentDate.getFullYear(), 
    currentDate.getMonth() + 1, 
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(), 
    currentDate.getMonth(), 
    1
  ).getDay();
  
  // Generate mock attendance data
  const generateAttendanceData = (): AttendanceDay[] => {
    const data: AttendanceDay[] = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const randomStatus = Math.random();
      let status: AttendanceDay['status'] = 'present';
      
      if (randomStatus < 0.1) status = 'absent';
      else if (randomStatus < 0.15) status = 'half-day';
      else if (randomStatus < 0.2) status = 'holiday';
      
      data.push({ date, status });
    }
    return data;
  };
  
  const attendanceData = generateAttendanceData();
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  return (
    <div className="attendance-calendar">
      <div className="calendar-header">
        <button onClick={() => navigateMonth('prev')}>←</button>
        <h3>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h3>
        <button onClick={() => navigateMonth('next')}>→</button>
      </div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day empty"></div>
        ))}
        
        {attendanceData.map((day, index) => (
          <div key={index} className={`calendar-day ${day.status}`}>
            {day.date.getDate()}
            <div className="day-status"></div>
          </div>
        ))}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="color-present"></div>
          <span>Present</span>
        </div>
        <div className="legend-item">
          <div className="color-absent"></div>
          <span>Absent</span>
        </div>
        <div className="legend-item">
          <div className="color-half-day"></div>
          <span>Half Day</span>
        </div>
        <div className="legend-item">
          <div className="color-holiday"></div>
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
};
