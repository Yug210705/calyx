import { taskService } from '../services/api';
import React, { useState } from 'react';
import {
  AlertCircle, Calendar, Users, Clock,
  Bug, Bookmark, Zap, CheckSquare,
  ArrowUp, ArrowDown, Minus, ArrowRight,
  Plus, X, Trash2, Info, Command
} from 'lucide-react';
import './MyWork.css';

/* â”€â”€ Types â”€â”€ */
interface Task {
  id: number;
  key: string;
  title: string;
  type: 'task' | 'bug' | 'story' | 'epic';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'inProgress' | 'review' | 'done';
  project: string;
  dateStr: string;
  category: 'overdue' | 'today' | 'assigned';
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  todo: { label: 'TO DO', cls: 'mw-st-todo' },
  inProgress: { label: 'IN PROGRESS', cls: 'mw-st-progress' },
  review: { label: 'IN REVIEW', cls: 'mw-st-review' },
  done: { label: 'DONE', cls: 'mw-st-done' },
};

const INITIAL_TASKS: Task[] = [
  { id: 1, key: 'ATL-1042', title: 'Fix OAuth token refresh bug in mobile client', type: 'bug', priority: 'urgent', status: 'inProgress', project: 'Atlas Mobile App', dateStr: 'Yesterday', category: 'overdue' },
  { id: 2, key: 'ATL-1011', title: 'Resolve race condition in worker pool', type: 'bug', priority: 'high', status: 'todo', project: 'Backend Infrastructure', dateStr: 'Aug 22', category: 'overdue' },
  { id: 3, key: 'ATL-1045', title: 'Implement rate limiting middleware for API Gateway', type: 'task', priority: 'high', status: 'todo', project: 'API Gateway', dateStr: 'Today', category: 'today' },
  { id: 4, key: 'ATL-1051', title: 'Review pull request #342 for User Service', type: 'task', priority: 'medium', status: 'review', project: 'User Management', dateStr: 'Today', category: 'today' },
  { id: 5, key: 'ATL-1060', title: 'Design My Work dashboard UI components', type: 'story', priority: 'high', status: 'inProgress', project: 'Frontend App', dateStr: 'Aug 28', category: 'assigned' },
  { id: 6, key: 'ATL-1072', title: 'Add unit tests for authentication service', type: 'task', priority: 'medium', status: 'todo', project: 'Backend Services', dateStr: 'Aug 30', category: 'assigned' },
  { id: 7, key: 'ATL-1080', title: 'Optimize database query for activity feed', type: 'task', priority: 'medium', status: 'todo', project: 'Platform', dateStr: 'Sep 02', category: 'assigned' },
];

/* â”€â”€ Icon Helpers â”€â”€ */
const TypeIcon = ({ type }: { type: Task['type'] }) => {
  switch (type) {
    case 'bug': return <Bug size={14} className="mw-type bug" />;
    case 'story': return <Bookmark size={14} className="mw-type story" />;
    case 'epic': return <Zap size={14} className="mw-type epic" />;
    default: return <CheckSquare size={14} className="mw-type task" />;
  }
};

const PriorityIcon = ({ priority }: { priority: Task['priority'] }) => {
  switch (priority) {
    case 'urgent': return <ArrowUp size={14} className="mw-pri urgent" />;
    case 'high': return <ArrowUp size={14} className="mw-pri high" />;
    case 'low': return <ArrowDown size={14} className="mw-pri low" />;
    default: return <Minus size={14} className="mw-pri medium" />;
  }
};


/* â”€â”€ Main â”€â”€ */
export const MyWork = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [nextId, setNextId] = useState(20);
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await taskService.getTasks();
        const now = new Date();
        const mapped = data.map((t: any) => {
          let category = 'assigned';
          if (t.due_date) {
            const due = new Date(t.due_date);
            if (due < now && t.status !== 'Done') category = 'overdue';
            else if (due.toDateString() === now.toDateString()) category = 'today';
          } else {
             // Assign some mock categories based on ID just so the UI looks populated for empty states
             if (t.id % 3 === 0) category = 'overdue';
             else if (t.id % 2 === 0) category = 'today';
          }
          
          return {
            id: t.id,
            key: `ATL-${t.id}`,
            title: t.title,
            type: 'task',
            priority: 'medium',
            status: t.status === 'Todo' ? 'todo' : t.status === 'In Progress' ? 'inProgress' : t.status === 'Done' ? 'done' : 'todo',
            project: 'Assigned Project',
            dateStr: t.due_date ? new Date(t.due_date).toLocaleDateString() : 'TBD',
            category
          };
        });
        setTasks(mapped);
      } catch (err) {
        console.error("Failed to load tasks", err);
      }
    };
    loadTasks();
  }, []);
  const [form, setForm] = useState({
    title: '', project: '', type: 'task' as Task['type'],
    priority: 'medium' as Task['priority'], status: 'todo' as Task['status'],
    category: 'assigned' as Task['category'], dateStr: '',
  });

  const overdue = tasks.filter(t => t.category === 'overdue');
  const today = tasks.filter(t => t.category === 'today');
  const assigned = tasks.filter(t => t.category === 'assigned');

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const task: Task = {
      id: nextId, key: `ATL-${1080 + nextId}`, title: form.title,
      type: form.type, priority: form.priority, status: form.status,
      project: form.project || 'Unassigned', dateStr: form.dateStr || 'TBD',
      category: form.category,
    };
    setTasks([...tasks, task]);
    setNextId(nextId + 1);
    setShowModal(false);
    setForm({ title: '', project: '', type: 'task', priority: 'medium', status: 'todo', category: 'assigned', dateStr: '' });
  };

  const deleteTask = (id: number) => setTasks(tasks.filter(t => t.id !== id));

  const sections = [
    { key: 'overdue', title: 'Overdue', icon: AlertCircle, color: '#de350b', tasks: overdue, link: 'View all overdue' },
    { key: 'today', title: 'Due Today', icon: Calendar, color: '#ff991f', tasks: today, link: 'View all due today' },
    { key: 'assigned', title: 'Assigned to me', icon: CheckSquare, color: '#0052cc', tasks: assigned, link: 'View all assigned' },
  ];

  return (
    <div className="mw-page custom-scrollbar">
      {/* â”€â”€ Header â”€â”€ */}
      <div className="mw-header">
        <div className="mw-header-left">
          <h1 className="mw-title">My Work</h1>
          <p className="mw-subtitle">Your personal workspace for today's priorities.</p>
        </div>
        <div className="mw-header-cards">
          <div className="mw-kpi-card mw-kpi-danger">
            <Calendar size={20} />
            <div className="mw-kpi-data">
              <span className="mw-kpi-value">{overdue.length}</span>
              <span className="mw-kpi-label">Overdue</span>
              <span className="mw-kpi-sub">Needs attention</span>
            </div>
          </div>
          <div className="mw-kpi-card mw-kpi-warning">
            <Clock size={20} />
            <div className="mw-kpi-data">
              <span className="mw-kpi-value">{today.length}</span>
              <span className="mw-kpi-label">Due Today</span>
              <span className="mw-kpi-sub">Tasks due today</span>
            </div>
          </div>
          <div className="mw-kpi-card mw-kpi-info">
            <Users size={20} />
            <div className="mw-kpi-data">
              <span className="mw-kpi-value">{assigned.length}</span>
              <span className="mw-kpi-label">Assigned to me</span>
              <span className="mw-kpi-sub">Tasks assigned</span>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Sections â”€â”€ */}
      <div className="mw-sections">
        {sections.map(sec => (
          <div className="mw-section" key={sec.key}>
            <div className="mw-section-header">
              <div className="mw-section-left">
                <sec.icon size={16} style={{ color: sec.color }} />
                <span className="mw-section-title">{sec.title}</span>
                <span className="mw-section-count">{sec.tasks.length}</span>
              </div>
              <div className="mw-section-right">
                <button className="mw-add-btn" onClick={() => { setForm({ ...form, category: sec.key as Task['category'] }); setShowModal(true); }}>
                  <Plus size={14} /> Add
                </button>
                <a className="mw-view-link" href="#">{sec.link} <ArrowRight size={13} /></a>
              </div>
            </div>

            {sec.tasks.length > 0 ? (
              <div className="mw-table">
                <div className="mw-table-head">
                  <div className="mw-th mw-col-key">Key</div>
                  <div className="mw-th mw-col-summary">Summary</div>
                  <div className="mw-th mw-col-project">Project</div>
                  <div className="mw-th mw-col-p">P</div>
                  <div className="mw-th mw-col-status">Status</div>
                  <div className="mw-th mw-col-date">Date</div>
                  <div className="mw-th mw-col-actions"></div>
                </div>
                {sec.tasks.map(task => {
                  const st = STATUS_MAP[task.status];
                  return (
                    <div className="mw-table-row" key={task.id}>
                      <div className="mw-td mw-col-key">
                        <TypeIcon type={task.type} />
                        <span className="mw-key-text">{task.key}</span>
                      </div>
                      <div className="mw-td mw-col-summary">{task.title}</div>
                      <div className="mw-td mw-col-project">{task.project}</div>
                      <div className="mw-td mw-col-p"><PriorityIcon priority={task.priority} /></div>
                      <div className="mw-td mw-col-status">
                        <span className={`mw-status-pill ${st.cls}`}>{st.label}</span>
                      </div>
                      <div className={`mw-td mw-col-date ${sec.key === 'overdue' ? 'mw-date-danger' : ''}`}>{task.dateStr}</div>
                      <div className="mw-td mw-col-actions">
                        <button className="mw-delete-btn" onClick={() => deleteTask(task.id)} title="Remove task">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mw-empty-section">No tasks here. You're all caught up!</div>
            )}
          </div>
        ))}
      </div>

      {/* â”€â”€ Tip Bar â”€â”€ */}
      {showTip && (
        <div className="mw-tip-bar">
          <div className="mw-tip-content">
            <Info size={14} />
            <span>Tip: Use the filters above or keyboard shortcut</span>
            <kbd>âŒ˜</kbd><kbd>K</kbd>
            <span>to quickly find tasks and stay focused.</span>
          </div>
          <button className="mw-tip-close" onClick={() => setShowTip(false)}><X size={14} /></button>
        </div>
      )}

      {/* â”€â”€ Create Modal â”€â”€ */}
      {showModal && (
        <div className="mw-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="mw-modal" onClick={e => e.stopPropagation()}>
            <div className="mw-modal-header">
              <h2>Add Task</h2>
              <button className="mw-modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="mw-modal-body">
              <div className="mw-modal-field">
                <label>Summary <span className="req">*</span></label>
                <input type="text" placeholder="What needs to be done?" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
              </div>
              <div className="mw-modal-row">
                <div className="mw-modal-field">
                  <label>Project</label>
                  <input type="text" placeholder="e.g. Atlas Mobile App" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} />
                </div>
                <div className="mw-modal-field">
                  <label>Date</label>
                  <input type="text" placeholder="e.g. Sep 05" value={form.dateStr} onChange={e => setForm({ ...form, dateStr: e.target.value })} />
                </div>
              </div>
              <div className="mw-modal-row">
                <div className="mw-modal-field">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Task['type'] })}>
                    <option value="task">Task</option>
                    <option value="bug">Bug</option>
                    <option value="story">Story</option>
                    <option value="epic">Epic</option>
                  </select>
                </div>
                <div className="mw-modal-field">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Task['priority'] })}>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="mw-modal-row">
                <div className="mw-modal-field">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Task['status'] })}>
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="mw-modal-field">
                  <label>Section</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Task['category'] })}>
                    <option value="overdue">Overdue</option>
                    <option value="today">Due Today</option>
                    <option value="assigned">Assigned to me</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mw-modal-footer">
              <button className="mw-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="mw-modal-create" onClick={handleCreate} disabled={!form.title.trim()}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

