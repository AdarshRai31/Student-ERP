import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AcademicCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 1, title: 'Semester Start', date: '2023-07-01', type: 'academic' },
    { id: 2, title: 'Mid-Term Exams', date: '2023-08-15', type: 'exam' },
    { id: 3, title: 'Cultural Fest', date: '2023-09-05', type: 'event' },
    { id: 4, title: 'Semester End', date: '2023-12-15', type: 'academic' },
  ];

  const getEventColor = (type: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      exam: 'bg-red-100 text-red-800',
      event: 'bg-green-100 text-green-800',
      holiday: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(direction === 'prev' ? newDate.getMonth() - 1 : newDate.getMonth() + 1);
    } else {
      newDate.setDate(direction === 'prev' ? newDate.getDate() - 7 : newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        events: [],
      });
    }
    days.reverse();

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayEvents = events.filter(event => 
        new Date(event.date).toDateString() === date.toDateString()
      );
      days.push({
        date,
        isCurrentMonth: true,
        events: dayEvents,
      });
    }

    // Next month's days
    const totalCells = 42; // 6 weeks
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        events: [],
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Academic Calendar</h1>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center">
          <FiPlus className="mr-2" /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiChevronLeft />
            </button>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button 
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiChevronRight />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${view === 'month' ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${view === 'week' ? 'bg-primary-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setView('week')}
            >
              Week
            </button>
          </div>
        </div>

        {view === 'month' ? (
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="text-center font-semibold text-gray-600 py-2">Time</div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
        )}

        {view === 'month' ? (
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`min-h-24 p-2 border rounded-lg ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${
                  day.date.toDateString() === new Date().toDateString() ? 'border-primary-500 border-2' : 'border-gray-200'
                }`}
              >
                <div className="text-right mb-2">
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.events.map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded ${getEventColor(event.type)}`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-2">
            <div className="space-y-2">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="h-16 text-xs text-gray-500 text-right pr-2">
                  {i + 8}:00
                </div>
              ))}
            </div>
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="space-y-2">
                {Array.from({ length: 12 }, (_, j) => (
                  <div key={j} className="h-16 border border-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 border-b">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getEventColor(event.type)}`}>
                  {event.type}
                </span>
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
          <h2 className="text-lg font-semibold mb-4">Event Statistics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Academic Events</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Exams</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Cultural Events</span>
                <span className="text-sm font-medium">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Holidays</span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
