import React, { useState, useRef } from 'react';
import {
  Edit3, Settings, Mail, AtSign, Check, CheckCheck,
  ArrowUp, Bookmark, MoreVertical, Send, Plus,
  Smile, Paperclip, Link, Bold, Italic, Strikethrough,
  Code, List, ListOrdered, Archive, Clock, Eye,
  ChevronDown, ExternalLink
} from 'lucide-react';
import './Inbox.css';

/* ── Types ── */
interface InboxMessage {
  id: number;
  sender: { name: string; avatar: string };
  subject: string;
  preview: string;
  time: string;
  date: string;
  dateGroup: string;
  read: boolean;
  type: 'approval' | 'mention' | 'assignment' | 'update' | 'reminder' | 'system';
  priority: 'high' | 'medium' | 'low';
  project: string;
  relatedTo: string;
  status: string;
  assignee: string;
  created: string;
  tag?: string;
  thread: ThreadMessage[];
}

interface ThreadMessage {
  id: number;
  sender: { name: string; avatar: string };
  time: string;
  text: string;
  isYou?: boolean;
  actions?: { label: string; variant: 'primary' | 'outline' }[];
  reactions?: { emoji: string; count: number }[];
}

/* ── Data ── */
const USERS = {
  sarah: { name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  david: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=david' },
  system: { name: 'System Admin', avatar: 'https://i.pravatar.cc/150?u=system' },
  megan: { name: 'Megan Black', avatar: 'https://i.pravatar.cc/150?u=megan' },
  alex: { name: 'Alex Morgan', avatar: 'https://i.pravatar.cc/150?u=alex' },
  bot: { name: 'Sprint Bot', avatar: 'https://i.pravatar.cc/150?u=bot' },
  backup: { name: 'Backup Service', avatar: 'https://i.pravatar.cc/150?u=backup' },
  you: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=yug' },
};

const INITIAL_MESSAGES: InboxMessage[] = [
  {
    id: 1, sender: USERS.sarah, subject: 'Approval requested for PR #4192', preview: 'The new OAuth2 implementation is r...', time: '10:10 AM', date: 'Today', dateGroup: 'TODAY',
    read: false, type: 'approval', priority: 'high', project: 'Backend Infrastructure', relatedTo: 'PR #4192', status: 'IN PROGRESS', assignee: 'Sarah Jenkins', created: 'May 21, 2025 at 10:10 AM', tag: 'External',
    thread: [
      { id: 1, sender: USERS.sarah, time: '10:10 AM', text: 'The new OAuth2 implementation is ready for review. All integration tests are passing in CI.', actions: [{ label: 'Approve', variant: 'primary' }, { label: 'View PR', variant: 'outline' }] },
      { id: 2, sender: USERS.you, time: '10:25 AM', text: 'Looks good! I\'ll review the changes and get back shortly.', isYou: true, reactions: [{ emoji: '👍', count: 1 }] },
      { id: 3, sender: USERS.sarah, time: '10:28 AM', text: 'Thanks! Let me know if you need any additional context.' },
    ]
  },
  {
    id: 2, sender: USERS.david, subject: 'Mentioned you in PROJ-892', preview: '@yug Can you confirm if we still ne...', time: '9:45 AM', date: 'Today', dateGroup: 'TODAY',
    read: false, type: 'mention', priority: 'medium', project: 'Frontend App', relatedTo: 'PROJ-892', status: 'TO DO', assignee: 'David Chen', created: 'May 21, 2025 at 9:45 AM',
    thread: [
      { id: 1, sender: USERS.david, time: '9:45 AM', text: '@yug Can you confirm if we still need the legacy fallback for the auth flow? The new implementation seems to cover all edge cases.' },
    ]
  },
  {
    id: 3, sender: USERS.system, subject: 'Assigned: INFRA-102', preview: 'This task has been assigned to you...', time: '8:30 AM', date: 'Today', dateGroup: 'TODAY',
    read: false, type: 'assignment', priority: 'medium', project: 'Infrastructure', relatedTo: 'INFRA-102', status: 'TO DO', assignee: 'You', created: 'May 21, 2025 at 8:30 AM',
    thread: [
      { id: 1, sender: USERS.system, time: '8:30 AM', text: 'Task INFRA-102 "Set up monitoring alerts for production database" has been assigned to you by the project lead.' },
    ]
  },
  {
    id: 4, sender: USERS.megan, subject: 'Updated documentation', preview: 'API Gateway rate limiting docume...', time: '5:15 PM', date: 'Yesterday', dateGroup: 'YESTERDAY',
    read: true, type: 'update', priority: 'low', project: 'API Gateway', relatedTo: 'DOC-45', status: 'DONE', assignee: 'Megan Black', created: 'May 20, 2025 at 5:15 PM',
    thread: [
      { id: 1, sender: USERS.megan, time: '5:15 PM', text: 'I\'ve updated the API Gateway rate limiting documentation with the new configuration options and examples. Please review when you get a chance.' },
    ]
  },
  {
    id: 5, sender: USERS.alex, subject: 'Request approved', preview: 'Your request for Access to Producti...', time: '3:20 PM', date: 'Yesterday', dateGroup: 'YESTERDAY',
    read: true, type: 'approval', priority: 'low', project: 'Admin', relatedTo: 'REQ-201', status: 'DONE', assignee: 'Alex Morgan', created: 'May 20, 2025 at 3:20 PM',
    thread: [
      { id: 1, sender: USERS.alex, time: '3:20 PM', text: 'Your request for access to the Production Monitoring Dashboard has been approved. You can now access it from the Integrations page.' },
    ]
  },
  {
    id: 6, sender: USERS.bot, subject: 'Reminder: Sprint Planning', preview: 'Sprint planning meeting at 10:00 A...', time: 'Yesterday', date: 'Yesterday', dateGroup: 'YESTERDAY',
    read: true, type: 'reminder', priority: 'medium', project: 'Sprint 14', relatedTo: 'SPRINT-14', status: 'UPCOMING', assignee: 'Sprint Bot', created: 'May 20, 2025 at 9:00 AM',
    thread: [
      { id: 1, sender: USERS.bot, time: '9:00 AM', text: 'Reminder: Sprint Planning meeting is scheduled for tomorrow at 10:00 AM. Please review the backlog items before the meeting.' },
    ]
  },
  {
    id: 7, sender: USERS.backup, subject: 'Backup completed successfully', preview: 'Your database backup has been co...', time: '2 days ago', date: 'Tue, May 20', dateGroup: 'TUE, MAY 20',
    read: true, type: 'system', priority: 'low', project: 'Infrastructure', relatedTo: 'SYS-88', status: 'DONE', assignee: 'Backup Service', created: 'May 19, 2025 at 2:00 AM',
    thread: [
      { id: 1, sender: USERS.backup, time: '2:00 AM', text: 'Your database backup has been completed successfully. Backup size: 2.4 GB. Next scheduled backup: May 26, 2025.' },
    ]
  },
];

/* ── Component ── */
export const Inbox = () => {
  const [messages, setMessages] = useState<InboxMessage[]>(INITIAL_MESSAGES);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions'>('all');
  const [replyText, setReplyText] = useState('');
  const [replyTab, setReplyTab] = useState<'reply' | 'note'>('reply');
  const replyRef = useRef<HTMLInputElement>(null);

  const selected = messages.find(m => m.id === selectedId) || messages[0];
  const unreadCount = messages.filter(m => !m.read).length;
  const mentionCount = messages.filter(m => m.type === 'mention').length;

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.read;
    if (filter === 'mentions') return m.type === 'mention';
    return true;
  });

  const grouped = filtered.reduce<Record<string, InboxMessage[]>>((acc, m) => {
    if (!acc[m.dateGroup]) acc[m.dateGroup] = [];
    acc[m.dateGroup].push(m);
    return acc;
  }, {});

  const selectMessage = (msg: InboxMessage) => {
    setSelectedId(msg.id);
    if (!msg.read) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    const newThread: ThreadMessage = {
      id: Date.now(), sender: USERS.you, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText.trim(), isYou: true,
    };
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, thread: [...m.thread, newThread] } : m));
    setReplyText('');
  };

  const markUnread = () => {
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, read: false } : m));
  };

  const archiveMessage = () => {
    setMessages(prev => prev.filter(m => m.id !== selectedId));
    const remaining = messages.filter(m => m.id !== selectedId);
    if (remaining.length > 0) setSelectedId(remaining[0].id);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'IN PROGRESS': return 'ib-st-progress';
      case 'TO DO': return 'ib-st-todo';
      case 'DONE': return 'ib-st-done';
      case 'UPCOMING': return 'ib-st-upcoming';
      default: return 'ib-st-todo';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'approval': return 'Approval';
      case 'mention': return 'Mention';
      case 'assignment': return 'Assignment';
      case 'update': return 'Update';
      case 'reminder': return 'Reminder';
      case 'system': return 'System';
      default: return type;
    }
  };

  return (
    <div className="ib-page">
      {/* ═══ LEFT: Inbox List ═══ */}
      <div className="ib-list-panel">
        <div className="ib-list-header">
          <div className="ib-list-title">
            <h2>Inbox</h2>
            <ChevronDown size={16} />
          </div>
          <div className="ib-list-actions">
            <button className="ib-icon-btn"><Edit3 size={16} /></button>
            <button className="ib-icon-btn"><Settings size={16} /></button>
          </div>
        </div>

        <div className="ib-list-tabs">
          <button className={`ib-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All <span className="ib-tab-badge">{messages.length}</span>
          </button>
          <button className={`ib-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
            Unread <span className="ib-tab-badge">{unreadCount}</span>
          </button>
          <button className={`ib-tab ${filter === 'mentions' ? 'active' : ''}`} onClick={() => setFilter('mentions')}>
            Mentions <span className="ib-tab-badge">{mentionCount}</span>
          </button>
        </div>

        <div className="ib-list-body custom-scrollbar">
          {Object.entries(grouped).map(([group, msgs]) => (
            <div key={group}>
              <div className="ib-date-group">{group}</div>
              {msgs.map(msg => (
                <div
                  key={msg.id}
                  className={`ib-list-item ${selectedId === msg.id ? 'selected' : ''} ${!msg.read ? 'unread' : ''}`}
                  onClick={() => selectMessage(msg)}
                >
                  <img src={msg.sender.avatar} alt="" className="ib-list-avatar" />
                  <div className="ib-list-content">
                    <div className="ib-list-top">
                      <span className="ib-list-sender">{msg.sender.name}</span>
                      <span className="ib-list-time">{msg.time}</span>
                    </div>
                    <div className="ib-list-subject">{msg.subject}</div>
                    <div className="ib-list-preview">{msg.preview}</div>
                  </div>
                  {!msg.read && <div className="ib-unread-dot" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CENTER: Thread View ═══ */}
      <div className="ib-thread-panel">
        {selected && (
          <>
            <div className="ib-thread-header">
              <h2 className="ib-thread-title">
                {selected.subject}: Refactor auth flow
                {selected.tag && <span className="ib-thread-tag">{selected.tag}</span>}
              </h2>
              <div className="ib-thread-header-actions">
                <button className="ib-icon-btn"><CheckCheck size={16} /></button>
                <button className="ib-icon-btn"><Bookmark size={16} /></button>
                <button className="ib-icon-btn"><MoreVertical size={16} /></button>
              </div>
            </div>

            <div className="ib-thread-body custom-scrollbar">
              {selected.thread.map((msg, idx) => (
                <div key={msg.id} className={`ib-thread-msg ${msg.isYou ? 'is-you' : ''}`}>
                  <img src={msg.sender.avatar} alt="" className="ib-thread-avatar" />
                  <div className="ib-thread-msg-content">
                    <div className="ib-thread-msg-header">
                      <span className="ib-thread-msg-sender">{msg.sender.name}</span>
                      <span className="ib-thread-msg-time">{msg.time}</span>
                    </div>
                    {idx === 0 && <div className="ib-thread-msg-to">to You ∨</div>}
                    <p className="ib-thread-msg-text">{msg.text}</p>
                    {msg.actions && (
                      <div className="ib-thread-actions">
                        {msg.actions.map(a => (
                          <button key={a.label} className={`ib-action-btn ${a.variant}`}>
                            {a.variant === 'primary' && <Check size={14} />} {a.label}
                            {a.variant === 'outline' && <ExternalLink size={12} />}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.reactions && (
                      <div className="ib-reactions">
                        {msg.reactions.map(r => (
                          <span key={r.emoji} className="ib-reaction">{r.emoji} {r.count}</span>
                        ))}
                        <button className="ib-reaction-add"><Smile size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {selected.thread.length > 1 && (
                <div className="ib-reply-count">{selected.thread.length - 1} {selected.thread.length - 1 === 1 ? 'reply' : 'replies'}</div>
              )}
            </div>

            <div className="ib-reply-area">
              <div className="ib-reply-tabs">
                <button className={`ib-reply-tab ${replyTab === 'reply' ? 'active' : ''}`} onClick={() => setReplyTab('reply')}>Reply</button>
                <button className={`ib-reply-tab ${replyTab === 'note' ? 'active' : ''}`} onClick={() => setReplyTab('note')}>Internal Note</button>
              </div>
              <div className="ib-reply-input-area">
                <input
                  ref={replyRef}
                  className="ib-reply-input"
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendReply(); }}
                />
                <button className="ib-reply-copy"><Bookmark size={14} /></button>
              </div>
              <div className="ib-reply-toolbar">
                <div className="ib-toolbar-left">
                  <button className="ib-tool-btn"><Plus size={16} /></button>
                  <button className="ib-tool-btn"><Smile size={16} /></button>
                  <button className="ib-tool-btn"><AtSign size={16} /></button>
                  <button className="ib-tool-btn"><Paperclip size={16} /></button>
                  <button className="ib-tool-btn"><Link size={16} /></button>
                  <span className="ib-toolbar-sep" />
                  <button className="ib-tool-btn"><Bold size={16} /></button>
                  <button className="ib-tool-btn"><Italic size={16} /></button>
                  <button className="ib-tool-btn"><Strikethrough size={16} /></button>
                  <button className="ib-tool-btn"><Code size={16} /></button>
                  <button className="ib-tool-btn"><List size={16} /></button>
                  <button className="ib-tool-btn"><ListOrdered size={16} /></button>
                </div>
                <div className="ib-toolbar-right">
                  <button className="ib-send-btn" onClick={sendReply} disabled={!replyText.trim()}>
                    Send
                  </button>
                  <button className="ib-send-dropdown"><ChevronDown size={14} /></button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══ RIGHT: Details Panel ═══ */}
      <div className="ib-details-panel custom-scrollbar">
        {selected && (
          <>
            <h3 className="ib-details-title">Details</h3>
            <div className="ib-details-grid">
              <div className="ib-detail-row">
                <span className="ib-detail-label">Type</span>
                <span className="ib-detail-value">{getTypeLabel(selected.type)}</span>
              </div>
              <div className="ib-detail-row">
                <span className="ib-detail-label">Priority</span>
                <span className="ib-detail-value ib-detail-priority">
                  <ArrowUp size={14} className={`ib-pri-icon ${selected.priority}`} />
                  {selected.priority.charAt(0).toUpperCase() + selected.priority.slice(1)}
                </span>
              </div>
              <div className="ib-detail-row">
                <span className="ib-detail-label">Project</span>
                <span className="ib-detail-value">{selected.project}</span>
              </div>
              <div className="ib-detail-row">
                <span className="ib-detail-label">Related to</span>
                <a className="ib-detail-link">{selected.relatedTo}</a>
              </div>
              <div className="ib-detail-row">
                <span className="ib-detail-label">Status</span>
                <span className={`ib-status-pill ${getStatusClass(selected.status)}`}>{selected.status}</span>
              </div>
              <div className="ib-detail-row">
                <span className="ib-detail-label">Assignee</span>
                <span className="ib-detail-value">{selected.assignee}</span>
              </div>
              <div className="ib-detail-row">
                <span className="ib-detail-label">Created</span>
                <span className="ib-detail-value">{selected.created}</span>
              </div>
            </div>

            <div className="ib-thread-actions-section">
              <h3 className="ib-details-title">Thread Actions</h3>
              <button className="ib-detail-action" onClick={markUnread}><Mail size={14} /> Mark as unread</button>
              <button className="ib-detail-action"><Clock size={14} /> Snooze</button>
              <button className="ib-detail-action" onClick={archiveMessage}><Archive size={14} /> Archive</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
