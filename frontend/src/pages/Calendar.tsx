import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, 
  Filter, ChevronDown, X
} from 'lucide-react';
import { taskService } from '../services/api';
import './Calendar.css';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({ title: '', due_date: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateStr = new Date(newEventData.due_date).toISOString();
      const created = await taskService.createTask({
        title: newEventData.title,
        due_date: dateStr,
        project_id: 1, // Defaulting to 1 for calendar events
        status: 'To Do',
        priority: 'Medium'
      });
      setTasks([...tasks, created]);
      setIsModalOpen(false);
      setNewEventData({ title: '', due_date: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const monthName = currentDate.toLocaleString('default', { month: 'short' });
  const year = currentDate.getFullYear();

  // Pseudo-random assignment for visual polish based on task ID
  const getEventTheme = (id: number) => {
    const themes = ['event-theme-purple', 'event-theme-green', 'event-theme-yellow', 'event-theme-blue'];
    return themes[id % 4];
  };

  const getEventTime = (id: number) => {
    const times = [
      "10:00 AM - 11:00 AM",
      "02:00 PM - 03:00 PM",
      "11:00 AM - 12:00 PM",
      "09:30 AM - 10:00 AM",
      "01:30 PM - 02:30 PM",
      "03:00 PM - 04:00 PM",
      "09:00 AM - 10:00 AM"
    ];
    return times[id % times.length];
  };

  const renderDays = () => {
    const days = [];
    const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // Total cells in the grid: enough to cover the month, usually 35 or 42
    const totalSlots = (firstDayIndex + daysInMonth) > 35 ? 42 : 35;

    for (let i = 0; i < totalSlots; i++) {
      const dayNum = i - firstDayIndex + 1;
      const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
      
      const loopDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
      const isToday = loopDate.toDateString() === new Date().toDateString();
      
      // Filter tasks due on this day
      const dayTasks = isCurrentMonth ? tasks.filter(t => {
        if (!t.due_date) return false;
        const taskDate = new Date(t.due_date);
        return taskDate.getDate() === dayNum && 
               taskDate.getMonth() === currentDate.getMonth() && 
               taskDate.getFullYear() === currentDate.getFullYear();
      }) : [];
      
      // Limit to max 2 tasks visually, show "+ X more"
      const visibleTasks = dayTasks.slice(0, 2);
      const hiddenCount = dayTasks.length - 2;

      days.push(
        <div key={i} className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}>
          <div className="cell-date">{isCurrentMonth ? dayNum : (dayNum <= 0 ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() + dayNum : dayNum - daysInMonth)}</div>
          
          {visibleTasks.map(task => (
            <div key={task.id} className={`event-chip ${getEventTheme(task.id)}`}>
              <div className="event-chip-header">
                <div className="event-dot"></div>
                <div className="event-title">{task.title}</div>
              </div>
              <div className="event-time">{getEventTime(task.id)}</div>
            </div>
          ))}
          {hiddenCount > 0 && (
            <div className="more-events">+ {hiddenCount} more</div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-page">
      <div className="global-page-header">
        <div className="global-page-header-left">
          <h1 className="calendar-title">Calendar</h1>
          <p className="calendar-subtitle">Plan your work and never miss an important deadline.</p>
        </div>
        
        <div className="global-page-header-right">
          <button className="btn-control" onClick={goToday}>Today</button>
          
          <div className="month-nav-group">
            <button className="nav-arrow" onClick={prevMonth}><ChevronLeft size={16} /></button>
            <button className="nav-arrow" onClick={nextMonth}><ChevronRight size={16} /></button>
          </div>
          
          <div className="current-month-label">
            {monthName} {year} <ChevronDown size={16} style={{color: '#94a3b8', marginLeft: '4px'}} />
          </div>
          
          <button className="btn-control">
            Month <ChevronDown size={14} style={{color: '#94a3b8'}} />
          </button>
          
          <button className="btn-control">
            <Filter size={14} /> Filter <ChevronDown size={14} style={{color: '#94a3b8'}} />
          </button>
          
          <button className="btn-primary-purple" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      <div className="calendar-grid-container">
        <div className="calendar-days-header">
          <div className="day-name">Sun</div>
          <div className="day-name">Mon</div>
          <div className="day-name">Tue</div>
          <div className="day-name">Wed</div>
          <div className="day-name">Thu</div>
          <div className="day-name">Fri</div>
          <div className="day-name">Sat</div>
        </div>
        
        <div className="calendar-grid">
          {renderDays()}
        </div>
      </div>

      {/* New Event Modal */}
      {isModalOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0, fontSize: '18px'}}>Create New Event</h2>
              <X size={18} style={{cursor: 'pointer'}} onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleCreateEvent} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Event Title</label>
                <input 
                  type="text" 
                  required
                  value={newEventData.title} 
                  onChange={e => setNewEventData({...newEventData, title: e.target.value})}
                  style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}} 
                />
              </div>
              
              <div>
                <label style={{display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px'}}>Date</label>
                <input 
                  type="date" 
                  required
                  value={newEventData.due_date} 
                  onChange={e => setNewEventData({...newEventData, due_date: e.target.value})}
                  style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px'}} 
                />
              </div>
              
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px'}}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', cursor: 'pointer'}}>Cancel</button>
                <button type="submit" style={{padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: 600}}>Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
