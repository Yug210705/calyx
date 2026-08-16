import React from 'react';
import '../Reports.css';
import { 
  CheckSquare, 
  ListTodo, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  Search,
  Filter
} from 'lucide-react';

export const ReportsTasks = () => {
  const tasks = [
    { id: 'TSK-1042', name: 'Update user authentication flow', assignee: 'Alex Rivera', assigneeAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', status: 'In Progress', priority: 'High', due: 'Today' },
    { id: 'TSK-1043', name: 'Design new landing page', assignee: 'Emily Davis', assigneeAvatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', status: 'To Do', priority: 'Medium', due: 'Tomorrow' },
    { id: 'TSK-1039', name: 'Fix navigation bug on mobile', assignee: 'Marcus Johnson', assigneeAvatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', status: 'Completed', priority: 'High', due: 'Yesterday' },
    { id: 'TSK-1045', name: 'Prepare Q3 performance report', assignee: 'Sarah Chen', assigneeAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', status: 'Blocked', priority: 'Urgent', due: 'May 30, 2024' },
    { id: 'TSK-1048', name: 'Update database schema', assignee: 'Michael Lee', assigneeAvatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', status: 'In Progress', priority: 'Low', due: 'Jun 05, 2024' },
  ];

  return (
    <div className="rpt-content-layout" style={{ flexDirection: 'column' }}>
      
      {/* KPI ROW */}
      <div className="rpt-kpi-row">
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-purple">
              <ListTodo size={20} />
            </div>
            <span className="rpt-kpi-label">Total Tasks</span>
          </div>
          <span className="rpt-kpi-value">1,204</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 8%</span>
            <span className="rpt-trend-vs">vs last month</span>
          </div>
        </div>
        
        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-green">
              <CheckSquare size={20} />
            </div>
            <span className="rpt-kpi-label">Completed</span>
          </div>
          <span className="rpt-kpi-value">845</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 12%</span>
            <span className="rpt-trend-vs">vs last month</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-orange">
              <AlertCircle size={20} />
            </div>
            <span className="rpt-kpi-label">Overdue</span>
          </div>
          <span className="rpt-kpi-value">32</span>
          <div className="rpt-kpi-trend rpt-trend-down">
            <span className="rpt-trend-arrow">↓ 5%</span>
            <span className="rpt-trend-vs">vs last month</span>
          </div>
        </div>

        <div className="rpt-kpi-card">
          <div className="rpt-kpi-top">
            <div className="rpt-kpi-icon-box rpt-icon-blue">
              <Clock size={20} />
            </div>
            <span className="rpt-kpi-label">Avg. Completion</span>
          </div>
          <span className="rpt-kpi-value">2.4d</span>
          <div className="rpt-kpi-trend">
            <span className="rpt-trend-arrow">↑ 0.2d</span>
            <span className="rpt-trend-vs">faster than avg</span>
          </div>
        </div>
      </div>

      {/* MAIN TABLE AREA */}
      <div className="rpt-card rpt-table-card" style={{ marginTop: '24px' }}>
        <div className="rpt-card-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <h2 className="rpt-card-title">All Tasks</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="rpt-dropdown">
              <Search size={14} className="rpt-text-muted" />
              <span>Search tasks...</span>
            </div>
            <div className="rpt-dropdown">
              <Filter size={14} className="rpt-text-muted" />
              <span>Filter</span>
            </div>
          </div>
        </div>
        
        <div className="rpt-table-container">
          <table className="rpt-table">
            <thead>
              <tr>
                <th style={{ width: '10%', textAlign: 'left', padding: '16px' }}>ID</th>
                <th style={{ width: '35%', textAlign: 'left', padding: '16px' }}>Task Name</th>
                <th style={{ width: '20%', textAlign: 'left', padding: '16px' }}>Assignee</th>
                <th style={{ width: '15%', textAlign: 'left', padding: '16px' }}>Status</th>
                <th style={{ width: '10%', textAlign: 'left', padding: '16px' }}>Priority</th>
                <th style={{ width: '10%', textAlign: 'left', padding: '16px' }}>Due</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
                    {task.id}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#334155' }}>
                    {task.name}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div className="rpt-member-info">
                      <img src={task.assigneeAvatar} alt={task.assignee} className="rpt-avatar" style={{ width: '24px', height: '24px' }} />
                      <div className="rpt-member-name" style={{ fontSize: '13px' }}>{task.assignee}</div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      fontSize: '13px',
                      color: '#475569'
                    }}>
                      <span className={`rpt-dot ${
                        task.status === 'Completed' ? 'rpt-dot-green' :
                        task.status === 'In Progress' ? 'rpt-dot-blue' :
                        task.status === 'Blocked' ? 'rpt-dot-red' : 'rpt-dot-grey'
                      }`}></span>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                     <span className={`rpt-badge ${
                        task.priority === 'Urgent' ? 'rpt-badge-over' :
                        task.priority === 'High' ? 'rpt-badge-over' :
                        task.priority === 'Medium' ? 'rpt-badge-optimal' : 'rpt-badge-under'
                      }`}>
                        {task.priority}
                      </span>
                  </td>
                  <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
                    {task.due}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
