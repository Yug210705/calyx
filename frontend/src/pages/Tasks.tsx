import { taskService, projectService } from '../services/api';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, MoreHorizontal, Filter, ChevronDown, X, 
  AlertCircle, ArrowUp, ArrowDown, Minus, Bug, 
  Bookmark, Zap, CheckSquare, User, Calendar,
  MessageSquare, Paperclip, Clock, Trash2, Edit3,
  Search, List, LayoutGrid, Star, Send, FolderOpen
} from 'lucide-react';
import './Tasks.css';

/* â”€â”€ Types â”€â”€ */
interface Comment {
  id: number;
  user: { name: string; avatar: string };
  text: string;
  time: string;
}

interface Task {
  id: number;
  key: string;
  title: string;
  description: string;
  project: string;
  type: 'task' | 'bug' | 'story' | 'epic';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'inProgress' | 'review' | 'done';
  assignee: { name: string; avatar: string } | null;
  storyPoints: number | null;
  labels: string[];
  comments: number;
  attachments: number;
  created: string;
  bookmarked: boolean;
  commentList: Comment[];
}

/* â”€â”€ Constants â”€â”€ */
const USERS = [
  { name: 'Yug Pratap', avatar: 'https://i.pravatar.cc/150?u=yug' },
  { name: 'Riya Sharma', avatar: 'https://i.pravatar.cc/150?u=riya' },
  { name: 'Arjun Singh', avatar: 'https://i.pravatar.cc/150?u=arjun' },
  { name: 'Neha Verma', avatar: 'https://i.pravatar.cc/150?u=neha' },
  { name: 'Pooja Yadav', avatar: 'https://i.pravatar.cc/150?u=pooja' },
];

const PROJECTS = ['Atlas Mobile App', 'Website Redesign', 'AI Dashboard', 'E-commerce Platform', 'Marketing Website', 'Internal Admin Panel'];

const COLUMNS = [
  { id: 'todo' as const, title: 'TO DO', color: '#7C3AED' },
  { id: 'inProgress' as const, title: 'IN PROGRESS', color: '#3B82F6' },
  { id: 'review' as const, title: 'IN REVIEW', color: '#F59E0B' },
  { id: 'done' as const, title: 'DONE', color: '#10B981' },
];

const INITIAL_TASKS: Task[] = [
  { id: 1, key: 'ATL-1', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', project: 'Atlas Mobile App', type: 'task', priority: 'high', status: 'todo', assignee: USERS[0], storyPoints: 5, labels: ['DevOps'], comments: 2, attachments: 0, created: '2024-05-18', bookmarked: false, commentList: [
    { id: 1, user: USERS[1], text: 'Should we use GitHub Actions or CircleCI?', time: '2 hours ago' },
    { id: 2, user: USERS[0], text: 'Let\'s go with GitHub Actions, it integrates better with our repo.', time: '1 hour ago' },
  ] },
  { id: 2, key: 'ATL-2', title: 'Design system updates', description: 'Update component library with new brand colors and tokens.', project: 'Website Redesign', type: 'story', priority: 'medium', status: 'todo', assignee: USERS[1], storyPoints: 3, labels: ['Design'], comments: 4, attachments: 1, created: '2024-05-17', bookmarked: true, commentList: [
    { id: 3, user: USERS[3], text: 'I have the new color palette ready in Figma.', time: '3 hours ago' },
    { id: 4, user: USERS[1], text: 'Great, I\'ll start implementing the token updates.', time: '2 hours ago' },
  ] },
  { id: 3, key: 'ATL-3', title: 'Research AI models', description: 'Evaluate GPT-4, Claude, and Gemini for text summarization use case.', project: 'AI Dashboard', type: 'task', priority: 'high', status: 'todo', assignee: USERS[2], storyPoints: 8, labels: ['Research'], comments: 1, attachments: 0, created: '2024-05-16', bookmarked: false, commentList: [
    { id: 5, user: USERS[2], text: 'Initial benchmarks show Claude has better summarization quality.', time: '5 hours ago' },
  ] },
  { id: 4, key: 'ATL-4', title: 'Fix login redirect bug', description: 'Users are not redirected to dashboard after OAuth login.', project: 'Atlas Mobile App', type: 'bug', priority: 'urgent', status: 'todo', assignee: USERS[3], storyPoints: 2, labels: ['Bug', 'Auth'], comments: 6, attachments: 0, created: '2024-05-19', bookmarked: true, commentList: [] },
  { id: 5, key: 'ATL-5', title: 'Implement JWT authentication', description: 'Set up JWT-based auth with refresh tokens and session management.', project: 'Atlas Mobile App', type: 'story', priority: 'high', status: 'inProgress', assignee: USERS[0], storyPoints: 8, labels: ['Backend', 'Auth'], comments: 3, attachments: 0, created: '2024-05-14', bookmarked: false, commentList: [] },
  { id: 6, key: 'ATL-6', title: 'Build landing page', description: 'Create a responsive hero section with animations.', project: 'Website Redesign', type: 'task', priority: 'medium', status: 'inProgress', assignee: USERS[1], storyPoints: 5, labels: ['Frontend'], comments: 2, attachments: 2, created: '2024-05-15', bookmarked: false, commentList: [] },
  { id: 7, key: 'ATL-7', title: 'AI insights API', description: 'Build REST endpoints for serving model predictions.', project: 'AI Dashboard', type: 'story', priority: 'high', status: 'review', assignee: USERS[2], storyPoints: 13, labels: ['Backend', 'AI'], comments: 5, attachments: 1, created: '2024-05-13', bookmarked: false, commentList: [] },
  { id: 8, key: 'ATL-8', title: 'Payment integration', description: 'Integrate Stripe for subscriptions and one-time payments.', project: 'E-commerce Platform', type: 'story', priority: 'high', status: 'review', assignee: USERS[3], storyPoints: 8, labels: ['Backend', 'Payments'], comments: 7, attachments: 0, created: '2024-05-10', bookmarked: false, commentList: [] },
  { id: 9, key: 'ATL-9', title: 'Homepage design review', description: 'Get design approval for the new homepage layout.', project: 'Website Redesign', type: 'task', priority: 'medium', status: 'review', assignee: USERS[1], storyPoints: 3, labels: ['Design'], comments: 8, attachments: 3, created: '2024-05-11', bookmarked: false, commentList: [] },
  { id: 10, key: 'ATL-10', title: 'Project setup & scaffolding', description: 'Initialize monorepo, configure ESLint, Prettier, and TypeScript.', project: 'Atlas Mobile App', type: 'task', priority: 'low', status: 'done', assignee: USERS[0], storyPoints: 3, labels: ['DevOps'], comments: 1, attachments: 0, created: '2024-05-08', bookmarked: false, commentList: [] },
  { id: 11, key: 'ATL-11', title: 'Database schema v1', description: 'Design and implement the initial PostgreSQL schema.', project: 'E-commerce Platform', type: 'task', priority: 'high', status: 'done', assignee: USERS[2], storyPoints: 5, labels: ['Backend', 'DB'], comments: 3, attachments: 1, created: '2024-05-07', bookmarked: false, commentList: [] },
  { id: 12, key: 'ATL-12', title: 'User roles & permissions', description: 'Implement RBAC with role hierarchy.', project: 'Internal Admin Panel', type: 'story', priority: 'high', status: 'done', assignee: USERS[4], storyPoints: 8, labels: ['Backend', 'Auth'], comments: 4, attachments: 0, created: '2024-05-06', bookmarked: false, commentList: [] },
];

/* â”€â”€ Helper Components â”€â”€ */
const TypeIcon = ({ type, size = 14 }: { type: string; size?: number }) => {
  switch (type) {
    case 'bug': return <Bug size={size} className="type-icon bug" />;
    case 'story': return <Bookmark size={size} className="type-icon story" />;
    case 'epic': return <Zap size={size} className="type-icon epic" />;
    default: return <CheckSquare size={size} className="type-icon task" />;
  }
};

const PriorityIcon = ({ priority, size = 14 }: { priority: string; size?: number }) => {
  switch (priority) {
    case 'urgent': return <ArrowUp size={size} className="priority-icon urgent" />;
    case 'high': return <ArrowUp size={size} className="priority-icon high" />;
    case 'low': return <ArrowDown size={size} className="priority-icon low" />;
    default: return <Minus size={size} className="priority-icon medium" />;
  }
};

const emptyForm = () => ({
  title: '', description: '', project: PROJECTS[0],
  type: 'task' as Task['type'], priority: 'medium' as Task['priority'],
  assigneeIndex: 0, storyPoints: '', labels: '', status: 'todo' as Task['status'],
});


/* â”€â”€ Main Component â”€â”€ */
export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeView, setActiveView] = useState('board');
  const [nextId, setNextId] = useState(13);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await taskService.getTasks();
        const mapped = (Array.isArray(data) ? data : []).map((t: any) => ({
          ...t,
          key: `ATL-${t.id}`,
          priority: 'medium',
          type: 'task',
          assignee: null,
          comments: 0,
          attachments: 0,
          bookmarked: false,
          commentList: [],
          status: t.status === 'Todo' ? 'todo' : t.status === 'In Progress' ? 'inProgress' : t.status === 'Done' ? 'done' : 'todo'
        }));
        setTasks(mapped);
      } catch (err) {
        console.error("Failed to load tasks", err);
      }
    };
    loadData();
  }, []);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [columnMenuId, setColumnMenuId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState(emptyForm());
  const [commentText, setCommentText] = useState('');
  const [nextCommentId, setNextCommentId] = useState(100);
  const commentInputRef = useRef<HTMLInputElement>(null);

  /* â”€â”€ Filtering Logic â”€â”€ */
  const filteredTasks = tasks.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.key.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterProject !== 'all' && t.project !== filterProject) return false;
    return true;
  });

  const activeFiltersCount = [filterPriority, filterType, filterProject].filter(f => f !== 'all').length;

  /* â”€â”€ Create â”€â”€ */
  const openCreateForColumn = (status: Task['status']) => {
    setNewTask({ ...emptyForm(), status });
    setShowCreateModal(true);
  };

  const handleCreate = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: nextId, key: `ATL-${nextId}`, title: newTask.title,
      description: newTask.description, project: newTask.project,
      type: newTask.type, priority: newTask.priority, status: newTask.status,
      assignee: USERS[newTask.assigneeIndex],
      storyPoints: newTask.storyPoints ? parseInt(newTask.storyPoints) : null,
      labels: newTask.labels ? newTask.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
      comments: 0, attachments: 0, created: new Date().toISOString().split('T')[0],
      bookmarked: false, commentList: [],
    };
    setTasks([...tasks, task]);
    setNextId(nextId + 1);
    setShowCreateModal(false);
    setNewTask(emptyForm());
  };

  /* â”€â”€ Bookmark â”€â”€ */
  const toggleBookmark = (taskId: number) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, bookmarked: !t.bookmarked } : t));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, bookmarked: !selectedTask.bookmarked });
    }
  };

  /* â”€â”€ Comment â”€â”€ */
  const addComment = (taskId: number) => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: nextCommentId, user: USERS[0],
      text: commentText.trim(), time: 'Just now',
    };
    const updatedTasks = tasks.map(t => t.id === taskId ? {
      ...t, comments: t.comments + 1, commentList: [...t.commentList, newComment],
    } : t);
    setTasks(updatedTasks);
    const updatedTask = updatedTasks.find(t => t.id === taskId);
    if (updatedTask) setSelectedTask(updatedTask);
    setCommentText('');
    setNextCommentId(nextCommentId + 1);
  };

  /* â”€â”€ Edit â”€â”€ */
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title, description: task.description, project: task.project,
      type: task.type, priority: task.priority,
      assigneeIndex: task.assignee ? USERS.findIndex(u => u.name === task.assignee!.name) : 0,
      storyPoints: task.storyPoints?.toString() || '', labels: task.labels.join(', '),
      status: task.status,
    });
    setSelectedTask(null);
    setShowCreateModal(true);
  };

  const handleUpdate = () => {
    if (!editingTask || !newTask.title.trim()) return;
    setTasks(tasks.map(t => t.id === editingTask.id ? {
      ...t, title: newTask.title, description: newTask.description,
      project: newTask.project, type: newTask.type, priority: newTask.priority,
      status: newTask.status, assignee: USERS[newTask.assigneeIndex],
      storyPoints: newTask.storyPoints ? parseInt(newTask.storyPoints) : null,
      labels: newTask.labels ? newTask.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
    } : t));
    setShowCreateModal(false);
    setEditingTask(null);
    setNewTask(emptyForm());
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingTask(null);
    setNewTask(emptyForm());
  };

  /* â”€â”€ Delete â”€â”€ */
  const handleDelete = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTask(null);
  };

  /* â”€â”€ Drag & Drop â”€â”€ */
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).classList.add('dragging');
  };
  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('dragging');
    setDraggedTask(null);
    setDragOverColumn(null);
  };
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };
  const handleDragLeave = () => setDragOverColumn(null);
  const handleDrop = (columnId: Task['status']) => {
    if (!draggedTask) return;
    setTasks(tasks.map(t => t.id === draggedTask.id ? { ...t, status: columnId } : t));
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  /* â”€â”€ Column menu actions â”€â”€ */
  const clearColumn = (columnId: Task['status']) => {
    setTasks(tasks.filter(t => t.status !== columnId));
    setColumnMenuId(null);
  };
  const moveAllTo = (from: Task['status'], to: Task['status']) => {
    setTasks(tasks.map(t => t.status === from ? { ...t, status: to } : t));
    setColumnMenuId(null);
  };

  /* â”€â”€ Reset Filters â”€â”€ */
  const resetFilters = () => {
    setFilterPriority('all');
    setFilterType('all');
    setFilterProject('all');
    setSearchQuery('');
    setShowFilterMenu(false);
  };

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• RENDER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  return (
    <div className="tasks-page" onClick={() => { setColumnMenuId(null); setShowFilterMenu(false); }}>
      {/* â”€â”€ Header â”€â”€ */}
      <div className="tasks-welcome">
        <div className="tasks-header">
          <div className="tasks-header-left">
            <h1 className="tasks-title">Tasks</h1>
            <p className="tasks-subtitle">Track and manage tasks across all projects.</p>
          </div>
          <div className="tasks-header-right">
            <div className="tasks-search-box">
              <Search size={15} />
              <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button className="search-clear" onClick={() => setSearchQuery('')}><X size={14} /></button>}
            </div>
            <div className="view-tabs">
              <button className={`view-tab ${activeView === 'board' ? 'active' : ''}`} onClick={() => setActiveView('board')}>
                <LayoutGrid size={14} /> Board
              </button>
              <button className={`view-tab ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')}>
                <List size={14} /> List
              </button>
            </div>
            <div className="filter-wrapper" onClick={e => e.stopPropagation()}>
              <button className={`tasks-filter-btn ${activeFiltersCount > 0 ? 'active-filter' : ''}`} onClick={() => setShowFilterMenu(!showFilterMenu)}>
                <Filter size={15} /> Filter {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>} <ChevronDown size={14} />
              </button>
              {showFilterMenu && (
                <div className="filter-dropdown">
                  <div className="filter-dropdown-header"><span>Filters</span>{activeFiltersCount > 0 && <button className="filter-reset" onClick={resetFilters}>Reset all</button>}</div>
                  <div className="filter-group">
                    <label>Priority</label>
                    <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
                      <option value="all">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Type</label>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                      <option value="all">All Types</option>
                      <option value="task">Task</option>
                      <option value="bug">Bug</option>
                      <option value="story">Story</option>
                      <option value="epic">Epic</option>
                    </select>
                  </div>
                  <div className="filter-group">
                    <label>Project</label>
                    <select value={filterProject} onChange={e => setFilterProject(e.target.value)}>
                      <option value="all">All Projects</option>
                      {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <button className="tasks-new-btn" onClick={() => { setEditingTask(null); setNewTask(emptyForm()); setShowCreateModal(true); }}>
              <Plus size={16} /> Create
            </button>
          </div>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• BOARD VIEW â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeView === 'board' && (
        <div className="board-container">
          {COLUMNS.map(column => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id);
            return (
              <div key={column.id}
                className={`board-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
                onDragOver={e => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="board-column-header">
                  <div className="board-column-left">
                    <span className="column-bar" style={{ backgroundColor: column.color }}></span>
                    <span className="column-title">{column.title}</span>
                    <span className="column-count">{columnTasks.length}</span>
                  </div>
                  <div className="column-actions">
                    <button className="column-action-btn" onClick={e => { e.stopPropagation(); openCreateForColumn(column.id); }}><Plus size={14} /></button>
                    <div className="column-menu-wrapper" onClick={e => e.stopPropagation()}>
                      <button className="column-action-btn" onClick={() => setColumnMenuId(columnMenuId === column.id ? null : column.id)}><MoreHorizontal size={14} /></button>
                      {columnMenuId === column.id && (
                        <div className="column-dropdown">
                          <button onClick={() => openCreateForColumn(column.id)}>Add task to {column.title.toLowerCase()}</button>
                          {column.id !== 'done' && <button onClick={() => moveAllTo(column.id, 'done')}>Move all to Done</button>}
                          {column.id !== 'todo' && <button onClick={() => moveAllTo(column.id, 'todo')}>Move all to To Do</button>}
                          <button className="danger-item" onClick={() => clearColumn(column.id)}>Clear column</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="board-column-body">
                  {columnTasks.map(task => (
                    <div key={task.id} className="jira-card"
                      draggable
                      onDragStart={e => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="jira-card-top">
                        <span className="jira-card-title">{task.title}</span>
                      </div>
                      {task.labels.length > 0 && (
                        <div className="jira-card-labels">
                          {task.labels.map(label => <span key={label} className="jira-label">{label}</span>)}
                        </div>
                      )}
                      <div className="jira-card-bottom">
                        <div className="jira-card-meta">
                          <TypeIcon type={task.type} />
                          <span className="jira-key">{task.key}</span>
                          <PriorityIcon priority={task.priority} />
                          {task.storyPoints && <span className="jira-sp">{task.storyPoints}</span>}
                        </div>
                        <div className="jira-card-right-meta">
                          {task.comments > 0 && <span className="jira-meta-item"><MessageSquare size={12} /> {task.comments}</span>}
                          {task.attachments > 0 && <span className="jira-meta-item"><Paperclip size={12} /> {task.attachments}</span>}
                          {task.assignee && <img src={task.assignee.avatar} alt={task.assignee.name} className="jira-avatar" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="empty-column" onClick={() => openCreateForColumn(column.id)}>
                      <Plus size={16} />
                      <span>Add a task</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• LIST VIEW â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {activeView === 'list' && (
        <div className="list-container">
          <div className="list-table-header">
            <div className="list-col-key">Key</div>
            <div className="list-col-title">Summary</div>
            <div className="list-col-type">Type</div>
            <div className="list-col-priority">Priority</div>
            <div className="list-col-status">Status</div>
            <div className="list-col-assignee">Assignee</div>
            <div className="list-col-sp">SP</div>
            <div className="list-col-actions"></div>
          </div>
          {filteredTasks.map(task => (
            <div key={task.id} className="list-row" onClick={() => setSelectedTask(task)}>
              <div className="list-col-key"><span className="list-key-text">{task.key}</span></div>
              <div className="list-col-title"><span className="list-title-text">{task.title}</span></div>
              <div className="list-col-type"><TypeIcon type={task.type} size={16} /> <span className="capitalize">{task.type}</span></div>
              <div className="list-col-priority"><PriorityIcon priority={task.priority} size={16} /> <span className="capitalize">{task.priority}</span></div>
              <div className="list-col-status">
                <span className="list-status-badge" style={{ backgroundColor: COLUMNS.find(c => c.id === task.status)?.color, color: 'white' }}>
                  {COLUMNS.find(c => c.id === task.status)?.title}
                </span>
              </div>
              <div className="list-col-assignee">
                {task.assignee && <><img src={task.assignee.avatar} alt="" className="list-avatar" /> {task.assignee.name}</>}
              </div>
              <div className="list-col-sp">{task.storyPoints ?? 'â€”'}</div>
              <div className="list-col-actions">
                <button className="list-action-btn" onClick={e => { e.stopPropagation(); openEdit(task); }}><Edit3 size={14} /></button>
                <button className="list-action-btn danger" onClick={e => { e.stopPropagation(); handleDelete(task.id); }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && <div className="list-empty">No tasks match your filters.</div>}
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• CREATE / EDIT MODAL â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTask ? `Edit ${editingTask.key}` : 'Create Issue'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="modal-row">
                <div className="modal-field">
                  <label>Project <span className="required">*</span></label>
                  <select value={newTask.project} onChange={e => setNewTask({ ...newTask, project: e.target.value })}>
                    {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Status</label>
                  <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value as Task['status'] })}>
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Issue Type <span className="required">*</span></label>
                  <select value={newTask.type} onChange={e => setNewTask({ ...newTask, type: e.target.value as Task['type'] })}>
                    <option value="task">Task</option>
                    <option value="bug">Bug</option>
                    <option value="story">Story</option>
                    <option value="epic">Epic</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="modal-field">
                <label>Summary <span className="required">*</span></label>
                <input type="text" placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} autoFocus />
              </div>
              <div className="modal-field">
                <label>Description</label>
                <textarea rows={4} placeholder="Add a detailed description..." value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div className="modal-row">
                <div className="modal-field">
                  <label>Assignee</label>
                  <select value={newTask.assigneeIndex} onChange={e => setNewTask({ ...newTask, assigneeIndex: parseInt(e.target.value) })}>
                    {USERS.map((u, i) => <option key={u.name} value={i}>{u.name}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Story Points</label>
                  <input type="number" placeholder="e.g. 5" value={newTask.storyPoints} onChange={e => setNewTask({ ...newTask, storyPoints: e.target.value })} />
                </div>
              </div>
              <div className="modal-field">
                <label>Labels</label>
                <input type="text" placeholder="Comma-separated, e.g. Frontend, Auth" value={newTask.labels} onChange={e => setNewTask({ ...newTask, labels: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={closeModal}>Cancel</button>
              <button className="modal-btn create" onClick={editingTask ? handleUpdate : handleCreate} disabled={!newTask.title.trim()}>
                {editingTask ? 'Save Changes' : 'Create Issue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• DETAIL SIDE PANEL â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {selectedTask && (
        <div className="detail-overlay" onClick={() => { setSelectedTask(null); setCommentText(''); }}>
          <div className="detail-panel" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="detail-header">
              <div className="detail-key-row">
                <TypeIcon type={selectedTask.type} size={18} />
                <span className="detail-key">{selectedTask.key}</span>
                <span className="detail-project-badge"><FolderOpen size={12} /> {selectedTask.project}</span>
              </div>
              <div className="detail-header-actions">
                <button
                  className={`detail-action-btn bookmark-btn ${selectedTask.bookmarked ? 'bookmarked' : ''}`}
                  onClick={() => toggleBookmark(selectedTask.id)}
                  title={selectedTask.bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  <Star size={16} fill={selectedTask.bookmarked ? '#F59E0B' : 'none'} />
                </button>
                <button className="detail-action-btn" onClick={() => openEdit(selectedTask)} title="Edit"><Edit3 size={16} /></button>
                <button className="detail-action-btn danger" onClick={() => handleDelete(selectedTask.id)} title="Delete"><Trash2 size={16} /></button>
                <button className="modal-close" onClick={() => { setSelectedTask(null); setCommentText(''); }}><X size={20} /></button>
              </div>
            </div>

            <div className="detail-body">
              {/* Title */}
              <h2 className="detail-title">{selectedTask.title}</h2>

              {/* Status Buttons */}
              <div className="detail-status-bar">
                {COLUMNS.map(col => (
                  <button key={col.id}
                    className={`detail-status-btn ${selectedTask.status === col.id ? 'active' : ''}`}
                    style={selectedTask.status === col.id ? { backgroundColor: col.color, borderColor: col.color, color: 'white' } : {}}
                    onClick={() => {
                      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, status: col.id } : t));
                      setSelectedTask({ ...selectedTask, status: col.id });
                    }}
                  >
                    {col.title}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="detail-section">
                <h4 className="detail-section-title">Description</h4>
                <div className="detail-desc-card">
                  <p className="detail-desc">{selectedTask.description || 'No description provided.'}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="detail-section">
                <h4 className="detail-section-title">Details</h4>
                <div className="detail-grid">
                  <div className="detail-grid-item">
                    <span className="grid-label"><User size={14} /> Assignee</span>
                    <div className="grid-value">
                      {selectedTask.assignee && <img src={selectedTask.assignee.avatar} alt="" className="field-avatar" />}
                      <span>{selectedTask.assignee?.name || 'Unassigned'}</span>
                    </div>
                  </div>
                  <div className="detail-grid-item">
                    <span className="grid-label"><AlertCircle size={14} /> Priority</span>
                    <div className="grid-value"><PriorityIcon priority={selectedTask.priority} size={16} /> <span className="capitalize">{selectedTask.priority}</span></div>
                  </div>
                  <div className="detail-grid-item">
                    <span className="grid-label"><CheckSquare size={14} /> Type</span>
                    <div className="grid-value"><TypeIcon type={selectedTask.type} size={16} /> <span className="capitalize">{selectedTask.type}</span></div>
                  </div>
                  <div className="detail-grid-item">
                    <span className="grid-label"><Bookmark size={14} /> Story Points</span>
                    <span className="grid-value">{selectedTask.storyPoints ?? 'â€”'}</span>
                  </div>
                  <div className="detail-grid-item">
                    <span className="grid-label"><Calendar size={14} /> Created</span>
                    <span className="grid-value">{selectedTask.created}</span>
                  </div>
                  <div className="detail-grid-item">
                    <span className="grid-label"><Star size={14} /> Bookmarked</span>
                    <span className="grid-value">{selectedTask.bookmarked ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Labels */}
              {selectedTask.labels.length > 0 && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Labels</h4>
                  <div className="detail-labels">
                    {selectedTask.labels.map(l => <span key={l} className="jira-label">{l}</span>)}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="detail-section">
                <h4 className="detail-section-title">
                  <MessageSquare size={14} /> Comments
                  <span className="comment-count">{selectedTask.commentList.length}</span>
                </h4>

                <div className="comments-list">
                  {selectedTask.commentList.length === 0 && (
                    <div className="no-comments">No comments yet. Be the first to comment!</div>
                  )}
                  {selectedTask.commentList.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <img src={comment.user.avatar} alt={comment.user.name} className="comment-avatar" />
                      <div className="comment-body">
                        <div className="comment-header">
                          <span className="comment-author">{comment.user.name}</span>
                          <span className="comment-time">{comment.time}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="comment-input-row">
                  <img src={USERS[0].avatar} alt="You" className="comment-avatar" />
                  <div className="comment-input-wrapper">
                    <input
                      ref={commentInputRef}
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addComment(selectedTask.id); }}
                    />
                    <button
                      className={`comment-send-btn ${commentText.trim() ? 'active' : ''}`}
                      onClick={() => addComment(selectedTask.id)}
                      disabled={!commentText.trim()}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="detail-section">
                <h4 className="detail-section-title">Activity</h4>
                <div className="detail-activity-placeholder">
                  <Clock size={16} />
                  <span>Created on {selectedTask.created}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

