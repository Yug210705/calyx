import { taskService } from '../services/api';
import React, { useState, useEffect } from 'react';
import {
  Search, ChevronDown, ChevronRight, Plus, X, Star,
  Filter, MoreHorizontal, GripVertical, Calendar,
  Bug, Bookmark, Zap, CheckSquare, Lightbulb, Wrench,
  ArrowUp, ArrowDown, Minus, MoreVertical, Trash2
} from 'lucide-react';
import './Backlog.css';

/* â”€â”€ Types â”€â”€ */
interface BacklogItem {
  id: number;
  key: string;
  title: string;
  type: 'task' | 'bug' | 'story' | 'epic';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  categoryColor: string;
  assignee: { name: string; avatar: string } | null;
  points: number | null;
  section: string;
}

/* â”€â”€ Data â”€â”€ */
const USERS = [
  { name: 'Yug Pratap', avatar: 'https://i.pravatar.cc/150?u=yug' },
  { name: 'Riya Sharma', avatar: 'https://i.pravatar.cc/150?u=riya' },
  { name: 'Arjun Singh', avatar: 'https://i.pravatar.cc/150?u=arjun' },
  { name: 'Neha Verma', avatar: 'https://i.pravatar.cc/150?u=neha' },
];

const INITIAL_ITEMS: BacklogItem[] = [
  { id: 1, key: 'ATL-142', title: 'Implement drag and drop for backlog items', type: 'story', priority: 'medium', category: 'UX IMPROVEMENTS', categoryColor: '#6366f1', assignee: USERS[0], points: 5, section: 'product' },
  { id: 2, key: 'ATL-145', title: 'Add dark mode toggle in preferences', type: 'story', priority: 'medium', category: 'SETTINGS', categoryColor: '#0ea5e9', assignee: USERS[1], points: 3, section: 'product' },
  { id: 3, key: 'ATL-148', title: 'Revamp notification system', type: 'epic', priority: 'medium', category: '', categoryColor: '', assignee: null, points: null, section: 'product' },
  { id: 4, key: 'ATL-152', title: 'Allow users to export reports to PDF', type: 'story', priority: 'medium', category: 'REPORTING', categoryColor: '#f97316', assignee: USERS[2], points: 8, section: 'product' },
  { id: 5, key: 'ATL-156', title: 'Fix pagination issue on reports page', type: 'bug', priority: 'high', category: 'BUG', categoryColor: '#ef4444', assignee: USERS[0], points: 2, section: 'bugs' },
  { id: 6, key: 'ATL-158', title: 'Resolve API timeout error on export', type: 'bug', priority: 'high', category: 'BUG', categoryColor: '#ef4444', assignee: USERS[3], points: 5, section: 'bugs' },
  { id: 7, key: 'ATL-159', title: 'Incorrect total count in dashboard widgets', type: 'bug', priority: 'medium', category: 'BUG', categoryColor: '#ef4444', assignee: USERS[1], points: 1, section: 'bugs' },
  { id: 8, key: 'ATL-170', title: 'Refactor authentication middleware', type: 'task', priority: 'medium', category: 'TECH DEBT', categoryColor: '#8b5cf6', assignee: USERS[2], points: 8, section: 'tech-debt' },
  { id: 9, key: 'ATL-171', title: 'Migrate database queries to ORM', type: 'task', priority: 'low', category: 'TECH DEBT', categoryColor: '#8b5cf6', assignee: null, points: 13, section: 'tech-debt' },
  { id: 10, key: 'ATL-175', title: 'Remove deprecated API endpoints', type: 'task', priority: 'low', category: 'TECH DEBT', categoryColor: '#8b5cf6', assignee: USERS[0], points: 3, section: 'tech-debt' },
  { id: 11, key: 'ATL-180', title: 'User-requested calendar integration', type: 'story', priority: 'medium', category: 'FEATURE REQUEST', categoryColor: '#10b981', assignee: null, points: null, section: 'feature-requests' },
  { id: 12, key: 'ATL-182', title: 'Bulk task operations from list view', type: 'story', priority: 'high', category: 'FEATURE REQUEST', categoryColor: '#10b981', assignee: USERS[3], points: 5, section: 'feature-requests' },
];

const SECTIONS = [
  { id: 'product', title: 'Product Ideas', icon: Lightbulb, color: '#f59e0b' },
  { id: 'bugs', title: 'Bugs', icon: Bug, color: '#ef4444' },
  { id: 'tech-debt', title: 'Technical Debt', icon: Wrench, color: '#8b5cf6' },
  { id: 'feature-requests', title: 'Feature Requests', icon: Star, color: '#10b981' },
];

/* â”€â”€ Helpers â”€â”€ */
const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'bug': return <Bug size={14} className="bl-type bug" />;
    case 'story': return <Bookmark size={14} className="bl-type story" />;
    case 'epic': return <Zap size={14} className="bl-type epic" />;
    default: return <CheckSquare size={14} className="bl-type task" />;
  }
};

const PriorityIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'urgent': return <ArrowUp size={14} className="bl-pri urgent" />;
    case 'high': return <ArrowUp size={14} className="bl-pri high" />;
    case 'low': return <ArrowDown size={14} className="bl-pri low" />;
    default: return <Minus size={14} className="bl-pri medium" />;
  }
};


/* â”€â”€ Component â”€â”€ */
export const Backlog = () => {
  const [items, setItems] = useState<BacklogItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await taskService.getTasks();
        const mapped = (Array.isArray(data) ? data : []).map((t: any) => {
          let section = 'product';
          if (t.id % 4 === 0) section = 'bugs';
          else if (t.id % 3 === 0) section = 'tech-debt';
          else if (t.id % 2 === 0) section = 'feature-requests';

          return {
            id: t.id,
            key: `ATL-${t.id}`,
            title: t.title,
            type: 'task',
            priority: 'medium',
            category: '',
            categoryColor: '#8b5cf6',
            assignee: null,
            points: null,
            section
          };
        });
        setItems(mapped);
      } catch (err) {
        console.error("Failed to load backlog", err);
      }
    };
    loadData();
  }, []);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map(s => [s.id, true]))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalSection, setModalSection] = useState('product');
  const [nextId, setNextId] = useState(200);
  const [form, setForm] = useState({
    title: '', type: 'task' as BacklogItem['type'],
    priority: 'medium' as BacklogItem['priority'],
    category: '', points: '',
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = items.filter(item =>
    !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const newItem: BacklogItem = {
      id: nextId, key: `ATL-${nextId}`, title: form.title,
      type: form.type, priority: form.priority,
      category: form.category.toUpperCase(), categoryColor: '#6366f1',
      assignee: USERS[0], points: form.points ? parseInt(form.points) : null,
      section: modalSection,
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
    setShowModal(false);
    setForm({ title: '', type: 'task', priority: 'medium', category: '', points: '' });
  };

  const deleteItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const openCreate = (sectionId: string) => {
    setModalSection(sectionId);
    setShowModal(true);
  };

  return (
    <div className="bl-page custom-scrollbar">
      {/* Breadcrumbs */}
      <div className="bl-breadcrumbs">
        <span>Projects</span> <span className="bl-sep">/</span>
        <span>Atlas Workspace</span> <span className="bl-sep">/</span>
        <span className="bl-current">Backlog</span>
      </div>

      {/* Header */}
      <div className="bl-header">
        <div className="bl-header-left">
          <h1 className="bl-title">Backlog <Star size={18} className="bl-star" /></h1>
          <p className="bl-subtitle">Plan, prioritize and track all the work in your backlog.</p>
        </div>
        <div className="bl-header-right">
          <button className="bl-btn-outline"><Calendar size={14} /> Schedule</button>
          <button className="bl-btn-primary"><Plus size={14} /> Create Sprint</button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bl-toolbar">
        <div className="bl-search-box">
          <Search size={15} />
          <input type="text" placeholder="Search backlog..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button className="bl-search-clear" onClick={() => setSearchQuery('')}><X size={14} /></button>}
        </div>
        <div className="bl-avatar-stack">
          {USERS.slice(0, 3).map((u, i) => (
            <img key={i} src={u.avatar} alt={u.name} className="bl-stack-avatar" style={{ zIndex: 3 - i }} />
          ))}
          <span className="bl-stack-more">+{USERS.length - 3}</span>
        </div>
        <button className="bl-toolbar-btn">Only My Issues</button>
        <button className="bl-toolbar-btn">Recently Updated</button>
        <button className="bl-toolbar-btn bl-filter-btn"><Filter size={14} /> Filters</button>
      </div>

      {/* Sections */}
      <div className="bl-sections">
        {SECTIONS.map(section => {
          const sectionItems = filtered.filter(i => i.section === section.id);
          const isOpen = expandedSections[section.id];

          return (
            <div className="bl-section" key={section.id}>
              <div className="bl-section-header" onClick={() => toggleSection(section.id)}>
                <div className="bl-section-left">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <section.icon size={16} style={{ color: section.color }} />
                  <span className="bl-section-title">{section.title}</span>
                  <span className="bl-section-count">{sectionItems.length} issues</span>
                </div>
                <button className="bl-section-menu" onClick={e => e.stopPropagation()}>
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {isOpen && (
                <>
                  {sectionItems.length > 0 && (
                    <div className="bl-table">
                      <div className="bl-table-head">
                        <div className="bl-th bl-col-drag"></div>
                        <div className="bl-th bl-col-key">Key</div>
                        <div className="bl-th bl-col-summary">Summary</div>
                        <div className="bl-th bl-col-category">Category</div>
                        <div className="bl-th bl-col-p">P â†“</div>
                        <div className="bl-th bl-col-assignee">Assignee</div>
                        <div className="bl-th bl-col-points"></div>
                        <div className="bl-th bl-col-actions"></div>
                      </div>
                      {sectionItems.map(item => (
                        <div className="bl-table-row" key={item.id}>
                          <div className="bl-td bl-col-drag">
                            <GripVertical size={14} className="bl-grip" />
                          </div>
                          <div className="bl-td bl-col-key">
                            <TypeIcon type={item.type} />
                            <span className="bl-key-text">{item.key}</span>
                          </div>
                          <div className="bl-td bl-col-summary">{item.title}</div>
                          <div className="bl-td bl-col-category">
                            {item.category ? (
                              <span className="bl-cat-pill" style={{ color: item.categoryColor, background: `${item.categoryColor}15`, border: `1px solid ${item.categoryColor}30` }}>
                                {item.category}
                              </span>
                            ) : <span className="bl-dash">â€”</span>}
                          </div>
                          <div className="bl-td bl-col-p"><PriorityIcon priority={item.priority} /></div>
                          <div className="bl-td bl-col-assignee">
                            {item.assignee ? (
                              <img src={item.assignee.avatar} alt={item.assignee.name} className="bl-assignee-avatar" />
                            ) : <span className="bl-dash">â€”</span>}
                          </div>
                          <div className="bl-td bl-col-points">
                            {item.points != null ? <span className="bl-points-circle">{item.points}</span> : <span className="bl-dash">-</span>}
                          </div>
                          <div className="bl-td bl-col-actions">
                            <button className="bl-row-menu" onClick={() => deleteItem(item.id)}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="bl-create-issue" onClick={() => openCreate(section.id)}>
                    <Plus size={14} /> Create issue
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* â”€â”€ Create Modal â”€â”€ */}
      {showModal && (
        <div className="bl-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="bl-modal" onClick={e => e.stopPropagation()}>
            <div className="bl-modal-header">
              <h2>Create Issue</h2>
              <button className="bl-modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="bl-modal-body">
              <div className="bl-modal-field">
                <label>Summary <span className="req">*</span></label>
                <input type="text" placeholder="What needs to be done?" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
              </div>
              <div className="bl-modal-row">
                <div className="bl-modal-field">
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as BacklogItem['type'] })}>
                    <option value="task">Task</option><option value="bug">Bug</option>
                    <option value="story">Story</option><option value="epic">Epic</option>
                  </select>
                </div>
                <div className="bl-modal-field">
                  <label>Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as BacklogItem['priority'] })}>
                    <option value="urgent">Urgent</option><option value="high">High</option>
                    <option value="medium">Medium</option><option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="bl-modal-row">
                <div className="bl-modal-field">
                  <label>Category</label>
                  <input type="text" placeholder="e.g. UX Improvements" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="bl-modal-field">
                  <label>Story Points</label>
                  <input type="number" placeholder="e.g. 5" value={form.points} onChange={e => setForm({ ...form, points: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="bl-modal-footer">
              <button className="bl-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="bl-modal-create" onClick={handleCreate} disabled={!form.title.trim()}>Create Issue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

