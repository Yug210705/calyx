import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Edit3, Settings, Mail, AtSign, Check, CheckCheck,
  ArrowUp, ArrowDown, Minus, Bookmark, MoreVertical, Send, Plus,
  Smile, Paperclip, Link, Bold, Italic, Strikethrough,
  Code, List, ListOrdered, Archive, Clock, Eye,
  ChevronDown, ExternalLink, Search, X, Trash2,
  Bell, BellOff, Pin, Forward, Reply, MailOpen,
  AlertCircle, Hash, Star, Filter
} from 'lucide-react';
import './Inbox.css';

/* ══════════════════════ TYPES ══════════════════════ */
interface User { name: string; avatar: string; }

interface Reaction { emoji: string; count: number; reacted: boolean; }

interface ThreadMessage {
  id: number;
  sender: User;
  time: string;
  text: string;
  isYou?: boolean;
  isNote?: boolean;
  actions?: { label: string; variant: 'primary' | 'outline'; done?: boolean }[];
  reactions: Reaction[];
}

interface InboxMessage {
  id: number;
  sender: User;
  subject: string;
  preview: string;
  time: string;
  dateGroup: string;
  read: boolean;
  starred: boolean;
  pinned: boolean;
  snoozed: boolean;
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

/* ══════════════════════ DATA ══════════════════════ */
const U: Record<string, User> = {
  sarah:  { name: 'Sarah Jenkins',  avatar: 'https://i.pravatar.cc/150?u=sarah' },
  david:  { name: 'David Chen',     avatar: 'https://i.pravatar.cc/150?u=david' },
  system: { name: 'System Admin',   avatar: 'https://i.pravatar.cc/150?u=system' },
  megan:  { name: 'Megan Black',    avatar: 'https://i.pravatar.cc/150?u=megan' },
  alex:   { name: 'Alex Morgan',    avatar: 'https://i.pravatar.cc/150?u=alex' },
  bot:    { name: 'Sprint Bot',     avatar: 'https://i.pravatar.cc/150?u=bot' },
  backup: { name: 'Backup Service', avatar: 'https://i.pravatar.cc/150?u=backup' },
  you:    { name: 'You',            avatar: 'https://i.pravatar.cc/150?u=yug' },
};

const SEED: InboxMessage[] = [
  {
    id: 1, sender: U.sarah, subject: 'Approval requested for PR #4192: Refactor auth flow', preview: 'The new OAuth2 implementation is ready for review. All integration tests are passing in CI.', time: '10:10 AM', dateGroup: 'TODAY',
    read: false, starred: false, pinned: false, snoozed: false,
    type: 'approval', priority: 'high', project: 'Backend Infrastructure', relatedTo: 'PR #4192', status: 'IN PROGRESS', assignee: 'Sarah Jenkins', created: 'May 21, 2025 at 10:10 AM', tag: 'External',
    thread: [
      { id: 1, sender: U.sarah, time: '10:10 AM', text: 'The new OAuth2 implementation is ready for review. All integration tests are passing in CI.', actions: [{ label: 'Approve', variant: 'primary' }, { label: 'View PR', variant: 'outline' }], reactions: [] },
      { id: 2, sender: U.you, time: '10:25 AM', text: 'Looks good! I\'ll review the changes and get back shortly.', isYou: true, reactions: [{ emoji: '👍', count: 1, reacted: false }] },
      { id: 3, sender: U.sarah, time: '10:28 AM', text: 'Thanks! Let me know if you need any additional context.', reactions: [] },
    ],
  },
  {
    id: 2, sender: U.david, subject: 'Mentioned you in PROJ-892', preview: '@yug Can you confirm if we still need the legacy fallback?', time: '9:45 AM', dateGroup: 'TODAY',
    read: false, starred: false, pinned: false, snoozed: false,
    type: 'mention', priority: 'medium', project: 'Frontend App', relatedTo: 'PROJ-892', status: 'TO DO', assignee: 'David Chen', created: 'May 21, 2025 at 9:45 AM',
    thread: [{ id: 1, sender: U.david, time: '9:45 AM', text: '@yug Can you confirm if we still need the legacy fallback for the auth flow? The new implementation seems to cover all edge cases.', reactions: [] }],
  },
  {
    id: 3, sender: U.system, subject: 'Assigned: INFRA-102', preview: 'This task has been assigned to you by the project lead.', time: '8:30 AM', dateGroup: 'TODAY',
    read: false, starred: true, pinned: false, snoozed: false,
    type: 'assignment', priority: 'medium', project: 'Infrastructure', relatedTo: 'INFRA-102', status: 'TO DO', assignee: 'You', created: 'May 21, 2025 at 8:30 AM',
    thread: [{ id: 1, sender: U.system, time: '8:30 AM', text: 'Task INFRA-102 "Set up monitoring alerts for production database" has been assigned to you by the project lead.', reactions: [] }],
  },
  {
    id: 4, sender: U.megan, subject: 'Updated documentation', preview: 'API Gateway rate limiting documentation has been updated.', time: '5:15 PM', dateGroup: 'YESTERDAY',
    read: true, starred: false, pinned: false, snoozed: false,
    type: 'update', priority: 'low', project: 'API Gateway', relatedTo: 'DOC-45', status: 'DONE', assignee: 'Megan Black', created: 'May 20, 2025 at 5:15 PM',
    thread: [{ id: 1, sender: U.megan, time: '5:15 PM', text: 'I\'ve updated the API Gateway rate limiting documentation with the new configuration options and examples. Please review when you get a chance.', reactions: [] }],
  },
  {
    id: 5, sender: U.alex, subject: 'Request approved', preview: 'Your request for Access to Production Monitoring has been approved.', time: '3:20 PM', dateGroup: 'YESTERDAY',
    read: true, starred: false, pinned: false, snoozed: false,
    type: 'approval', priority: 'low', project: 'Admin', relatedTo: 'REQ-201', status: 'DONE', assignee: 'Alex Morgan', created: 'May 20, 2025 at 3:20 PM',
    thread: [{ id: 1, sender: U.alex, time: '3:20 PM', text: 'Your request for access to the Production Monitoring Dashboard has been approved. You can now access it from the Integrations page.', reactions: [] }],
  },
  {
    id: 6, sender: U.bot, subject: 'Reminder: Sprint Planning', preview: 'Sprint planning meeting at 10:00 AM tomorrow.', time: 'Yesterday', dateGroup: 'YESTERDAY',
    read: true, starred: false, pinned: false, snoozed: false,
    type: 'reminder', priority: 'medium', project: 'Sprint 14', relatedTo: 'SPRINT-14', status: 'UPCOMING', assignee: 'Sprint Bot', created: 'May 20, 2025 at 9:00 AM',
    thread: [{ id: 1, sender: U.bot, time: '9:00 AM', text: 'Reminder: Sprint Planning meeting is scheduled for tomorrow at 10:00 AM. Please review the backlog items before the meeting.', reactions: [] }],
  },
  {
    id: 7, sender: U.backup, subject: 'Backup completed successfully', preview: 'Your database backup has been completed. Size: 2.4 GB.', time: '2 days ago', dateGroup: 'TUE, MAY 20',
    read: true, starred: false, pinned: false, snoozed: false,
    type: 'system', priority: 'low', project: 'Infrastructure', relatedTo: 'SYS-88', status: 'DONE', assignee: 'Backup Service', created: 'May 19, 2025 at 2:00 AM',
    thread: [{ id: 1, sender: U.backup, time: '2:00 AM', text: 'Your database backup has been completed successfully. Backup size: 2.4 GB. Next scheduled backup: May 26, 2025.', reactions: [] }],
  },
];

/* ══════════════════════ TOAST ══════════════════════ */
interface Toast { id: number; text: string; type: 'success' | 'info' | 'warning'; }

const ToastContainer = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) => (
  <div className="ib-toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`ib-toast ib-toast-${t.type}`}>
        {t.type === 'success' && <Check size={14} />}
        {t.type === 'info' && <AlertCircle size={14} />}
        {t.type === 'warning' && <Clock size={14} />}
        <span>{t.text}</span>
        <button onClick={() => onDismiss(t.id)}><X size={12} /></button>
      </div>
    ))}
  </div>
);

/* ══════════════════════ COMPOSE MODAL ══════════════════════ */
const ComposeModal = ({ onClose, onSend }: { onClose: () => void; onSend: (to: string, subject: string, body: string) => void }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="ib-modal-overlay" onClick={onClose}>
      <div className="ib-compose-modal" onClick={e => e.stopPropagation()}>
        <div className="ib-compose-header">
          <h3>New Message</h3>
          <button className="ib-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="ib-compose-body">
          <div className="ib-compose-field">
            <label>To</label>
            <input placeholder="Recipient name or email" value={to} onChange={e => setTo(e.target.value)} autoFocus />
          </div>
          <div className="ib-compose-field">
            <label>Subject</label>
            <input placeholder="Subject line" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="ib-compose-field">
            <label>Message</label>
            <textarea rows={6} placeholder="Write your message..." value={body} onChange={e => setBody(e.target.value)} />
          </div>
        </div>
        <div className="ib-compose-footer">
          <button className="ib-compose-cancel" onClick={onClose}>Discard</button>
          <button className="ib-compose-send" onClick={() => { onSend(to, subject, body); onClose(); }} disabled={!to.trim() || !subject.trim()}>
            <Send size={14} /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════ EMOJI PICKER ══════════════════════ */
const EMOJIS = ['👍', '❤️', '😂', '🎉', '🤔', '👀', '🚀', '💯'];

const EmojiPicker = ({ onSelect, onClose }: { onSelect: (e: string) => void; onClose: () => void }) => (
  <div className="ib-emoji-picker">
    {EMOJIS.map(e => (
      <button key={e} className="ib-emoji-option" onClick={() => { onSelect(e); onClose(); }}>{e}</button>
    ))}
  </div>
);

/* ══════════════════════ MAIN COMPONENT ══════════════════════ */
export const Inbox = () => {
  const [messages, setMessages] = useState<InboxMessage[]>(SEED);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyTab, setReplyTab] = useState<'reply' | 'note'>('reply');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState<{ msgId: number; threadId: number } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: number } | null>(null);
  const [typingIndicator, setTypingIndicator] = useState(false);

  const replyRef = useRef<HTMLTextAreaElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const selected = messages.find(m => m.id === selectedId);
  const unreadCount = messages.filter(m => !m.read).length;
  const mentionCount = messages.filter(m => m.type === 'mention').length;
  const starredCount = messages.filter(m => m.starred).length;

  /* ── Toast helper ── */
  const toast = useCallback((text: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const dismissToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  /* ── Scroll thread to bottom on new message ── */
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.thread.length]);

  /* ── Close context menu on click outside ── */
  useEffect(() => {
    const handler = () => { setContextMenu(null); setEmojiTarget(null); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const ids = filteredMessages.map(m => m.id);
      const idx = ids.indexOf(selectedId);
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        if (idx < ids.length - 1) selectMessage(ids[idx + 1]);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        if (idx > 0) selectMessage(ids[idx - 1]);
      } else if (e.key === 'r') {
        replyRef.current?.focus();
      } else if (e.key === 'e') {
        archiveMessage();
      } else if (e.key === 's') {
        toggleStar();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  /* ── Filtering ── */
  const filteredMessages = messages.filter(m => {
    if (filter === 'unread' && m.read) return false;
    if (filter === 'mentions' && m.type !== 'mention') return false;
    if (filter === 'starred' && !m.starred) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.subject.toLowerCase().includes(q) || m.sender.name.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q);
    }
    return true;
  });

  const grouped = filteredMessages.reduce<Record<string, InboxMessage[]>>((acc, m) => {
    const g = m.pinned ? '📌 PINNED' : m.dateGroup;
    if (!acc[g]) acc[g] = [];
    acc[g].push(m);
    return acc;
  }, {});

  /* ── Actions ── */
  const selectMessage = (id: number) => {
    setSelectedId(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    setReplyText('');
    setReplyTab('reply');
  };

  const sendReply = () => {
    if (!replyText.trim() || !selected) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ThreadMessage = {
      id: Date.now(), sender: U.you, time: timeStr,
      text: replyText.trim(), isYou: true,
      isNote: replyTab === 'note', reactions: [],
    };
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, thread: [...m.thread, newMsg] } : m));
    setReplyText('');
    toast(replyTab === 'note' ? 'Internal note added' : 'Reply sent', 'success');

    // Simulate typing response
    setTypingIndicator(true);
    setTimeout(() => {
      setTypingIndicator(false);
      if (selected) {
        const responder = selected.sender;
        const autoReply: ThreadMessage = {
          id: Date.now() + 1, sender: responder, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'Thanks for the update! I\'ll take a look at this shortly.', reactions: [],
        };
        setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, thread: [...m.thread, autoReply] } : m));
      }
    }, 2500);
  };

  const markUnread = () => {
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, read: false } : m));
    toast('Marked as unread', 'info');
  };

  const toggleStar = () => {
    const msg = messages.find(m => m.id === selectedId);
    if (!msg) return;
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, starred: !m.starred } : m));
    toast(msg.starred ? 'Removed from starred' : 'Added to starred', 'info');
  };

  const togglePin = () => {
    const msg = messages.find(m => m.id === selectedId);
    if (!msg) return;
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, pinned: !m.pinned } : m));
    toast(msg.pinned ? 'Unpinned' : 'Pinned to top', 'info');
  };

  const snoozeMessage = () => {
    setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, snoozed: true, read: true } : m));
    toast('Snoozed for 1 hour', 'warning');
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === selectedId ? { ...m, snoozed: false, read: false } : m));
      toast('Snoozed message is back!', 'info');
    }, 10000); // 10s demo instead of 1h
  };

  const archiveMessage = () => {
    const remaining = messages.filter(m => m.id !== selectedId);
    setMessages(remaining);
    if (remaining.length > 0) setSelectedId(remaining[0].id);
    toast('Conversation archived', 'success');
  };

  const deleteMessage = () => {
    const remaining = messages.filter(m => m.id !== selectedId);
    setMessages(remaining);
    if (remaining.length > 0) setSelectedId(remaining[0].id);
    toast('Conversation deleted', 'success');
  };

  const handleActionClick = (threadMsgId: number, actionLabel: string) => {
    setMessages(prev => prev.map(m => m.id === selectedId ? {
      ...m,
      thread: m.thread.map(tm => tm.id === threadMsgId ? {
        ...tm,
        actions: tm.actions?.map(a => a.label === actionLabel ? { ...a, done: true } : a),
      } : tm),
      status: actionLabel === 'Approve' ? 'APPROVED' : m.status,
    } : m));
    toast(`${actionLabel} action completed`, 'success');
  };

  const toggleReaction = (threadMsgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => m.id === selectedId ? {
      ...m,
      thread: m.thread.map(tm => {
        if (tm.id !== threadMsgId) return tm;
        const existing = tm.reactions.find(r => r.emoji === emoji);
        if (existing) {
          if (existing.reacted) {
            return { ...tm, reactions: tm.reactions.filter(r => r.emoji !== emoji || r.count > 1).map(r => r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r) };
          }
          return { ...tm, reactions: tm.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r) };
        }
        return { ...tm, reactions: [...tm.reactions, { emoji, count: 1, reacted: true }] };
      }),
    } : m));
  };

  const addEmojiFromPicker = (emoji: string) => {
    if (!emojiTarget) return;
    toggleReaction(emojiTarget.threadId, emoji);
  };

  const handleComposeSend = (to: string, subject: string, body: string) => {
    const newMsg: InboxMessage = {
      id: Date.now(), sender: U.you, subject: `Re: ${subject}`, preview: body.slice(0, 60),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateGroup: 'TODAY', read: true, starred: false, pinned: false, snoozed: false,
      type: 'update', priority: 'medium', project: 'General', relatedTo: '-',
      status: 'SENT', assignee: to, created: new Date().toLocaleString(),
      thread: [{ id: 1, sender: U.you, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: body, isYou: true, reactions: [] }],
    };
    setMessages(prev => [newMsg, ...prev]);
    setSelectedId(newMsg.id);
    toast('Message sent', 'success');
  };

  const handleContextMenu = (e: React.MouseEvent, msgId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, msgId });
  };

  const getStatusClass = (s: string) => {
    if (s === 'IN PROGRESS') return 'ib-st-progress';
    if (s === 'TO DO') return 'ib-st-todo';
    if (s === 'DONE' || s === 'APPROVED') return 'ib-st-done';
    if (s === 'UPCOMING') return 'ib-st-upcoming';
    if (s === 'SENT') return 'ib-st-sent';
    return 'ib-st-todo';
  };

  const getPriorityIcon = (p: string) => {
    if (p === 'high') return <ArrowUp size={14} className="ib-pri high" />;
    if (p === 'low') return <ArrowDown size={14} className="ib-pri low" />;
    return <Minus size={14} className="ib-pri medium" />;
  };

  /* ══════════════════════ RENDER ══════════════════════ */
  return (
    <div className="ib-page" onClick={() => { setContextMenu(null); setEmojiTarget(null); }}>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* ═══ LEFT PANEL ═══ */}
      <div className="ib-left">
        <div className="ib-left-header">
          <div className="ib-left-title-row">
            <h2>Inbox</h2>
            <ChevronDown size={16} className="ib-chevron" />
          </div>
          <div className="ib-left-actions">
            <button className="ib-icon-btn" title="Compose" onClick={(e) => { e.stopPropagation(); setShowCompose(true); }}><Edit3 size={15} /></button>
            <button className="ib-icon-btn" title="Settings"><Settings size={15} /></button>
          </div>
        </div>

        {/* Search */}
        <div className="ib-search-bar">
          <Search size={14} />
          <input placeholder="Search inbox..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button className="ib-search-clear" onClick={() => setSearchQuery('')}><X size={12} /></button>}
        </div>

        {/* Tabs */}
        <div className="ib-tabs">
          <button className={`ib-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All <span className="ib-tab-count">{messages.length}</span></button>
          <button className={`ib-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>Unread <span className="ib-tab-count">{unreadCount}</span></button>
          <button className={`ib-tab ${filter === 'mentions' ? 'active' : ''}`} onClick={() => setFilter('mentions')}>Mentions <span className="ib-tab-count">{mentionCount}</span></button>
          <button className={`ib-tab ${filter === 'starred' ? 'active' : ''}`} onClick={() => setFilter('starred')}>Starred <span className="ib-tab-count">{starredCount}</span></button>
        </div>

        {/* List */}
        <div className="ib-list custom-scrollbar">
          {Object.keys(grouped).length === 0 && (
            <div className="ib-empty-list">
              <MailOpen size={32} />
              <p>No messages found</p>
            </div>
          )}
          {Object.entries(grouped).map(([group, msgs]) => (
            <div key={group}>
              <div className="ib-date-label">{group}</div>
              {msgs.map(msg => (
                <div
                  key={msg.id}
                  className={`ib-item ${selectedId === msg.id ? 'selected' : ''} ${!msg.read ? 'unread' : ''} ${msg.snoozed ? 'snoozed' : ''}`}
                  onClick={() => selectMessage(msg.id)}
                  onContextMenu={e => handleContextMenu(e, msg.id)}
                >
                  <img src={msg.sender.avatar} alt="" className="ib-item-avatar" />
                  <div className="ib-item-body">
                    <div className="ib-item-row1">
                      <span className="ib-item-sender">{msg.sender.name}</span>
                      <span className="ib-item-time">{msg.time}</span>
                    </div>
                    <div className="ib-item-subject">{msg.subject}</div>
                    <div className="ib-item-preview">{msg.preview}</div>
                  </div>
                  <div className="ib-item-indicators">
                    {!msg.read && <span className="ib-dot" />}
                    {msg.starred && <Star size={12} className="ib-star-indicator" />}
                    {msg.pinned && <Pin size={10} className="ib-pin-indicator" />}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ CENTER PANEL ═══ */}
      <div className="ib-center">
        {selected ? (
          <>
            <div className="ib-center-header">
              <h2 className="ib-thread-title">
                {selected.subject}
                {selected.tag && <span className="ib-tag">{selected.tag}</span>}
              </h2>
              <div className="ib-center-actions">
                <button className="ib-icon-btn" title="Mark as done"><CheckCheck size={16} /></button>
                <button className={`ib-icon-btn ${selected.starred ? 'ib-starred' : ''}`} title="Star" onClick={toggleStar}><Bookmark size={16} /></button>
                <button className="ib-icon-btn" title="More" onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, msgId: selected.id }); }}><MoreVertical size={16} /></button>
              </div>
            </div>

            <div className="ib-thread custom-scrollbar">
              {selected.thread.map((tm, idx) => (
                <div key={tm.id} className={`ib-msg ${tm.isYou ? 'you' : ''} ${tm.isNote ? 'note' : ''}`}>
                  <img src={tm.sender.avatar} alt="" className="ib-msg-avatar" />
                  <div className="ib-msg-body">
                    <div className="ib-msg-head">
                      <span className="ib-msg-name">{tm.sender.name}</span>
                      <span className="ib-msg-time">{tm.time}</span>
                    </div>
                    {idx === 0 && <div className="ib-msg-to">to You ∨</div>}
                    {tm.isNote && <div className="ib-note-badge">Internal Note</div>}
                    <p className="ib-msg-text">{tm.text}</p>

                    {tm.actions && (
                      <div className="ib-msg-actions">
                        {tm.actions.map(a => (
                          <button
                            key={a.label}
                            className={`ib-action-btn ${a.variant} ${a.done ? 'done' : ''}`}
                            onClick={() => !a.done && handleActionClick(tm.id, a.label)}
                            disabled={a.done}
                          >
                            {a.done ? <Check size={14} /> : a.variant === 'primary' ? <Check size={14} /> : null}
                            {a.done ? `${a.label}d` : a.label}
                            {!a.done && a.variant === 'outline' && <ExternalLink size={12} />}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="ib-msg-reactions">
                      {tm.reactions.map(r => (
                        <button key={r.emoji} className={`ib-reaction ${r.reacted ? 'reacted' : ''}`} onClick={e => { e.stopPropagation(); toggleReaction(tm.id, r.emoji); }}>
                          {r.emoji} {r.count}
                        </button>
                      ))}
                      <button className="ib-add-reaction" onClick={e => { e.stopPropagation(); setEmojiTarget({ msgId: selected.id, threadId: tm.id }); }}>
                        <Smile size={14} />
                      </button>
                      {emojiTarget?.threadId === tm.id && (
                        <div onClick={e => e.stopPropagation()}>
                          <EmojiPicker onSelect={addEmojiFromPicker} onClose={() => setEmojiTarget(null)} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {typingIndicator && (
                <div className="ib-msg">
                  <img src={selected.sender.avatar} alt="" className="ib-msg-avatar" />
                  <div className="ib-msg-body">
                    <div className="ib-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={threadEndRef} />
            </div>

            {/* Reply Area */}
            <div className="ib-reply">
              <div className="ib-reply-tabs">
                <button className={`ib-rtab ${replyTab === 'reply' ? 'active' : ''}`} onClick={() => setReplyTab('reply')}><Reply size={13} /> Reply</button>
                <button className={`ib-rtab ${replyTab === 'note' ? 'active' : ''}`} onClick={() => setReplyTab('note')}><Hash size={13} /> Internal Note</button>
              </div>
              <div className={`ib-reply-box ${replyTab === 'note' ? 'note-mode' : ''}`}>
                <textarea
                  ref={replyRef}
                  className="ib-reply-input"
                  placeholder={replyTab === 'note' ? 'Write an internal note (not visible to external users)...' : 'Write a reply...'}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  rows={2}
                />
              </div>
              <div className="ib-reply-toolbar">
                <div className="ib-toolbar-left">
                  <button className="ib-tool"><Plus size={15} /></button>
                  <button className="ib-tool"><Smile size={15} /></button>
                  <button className="ib-tool"><AtSign size={15} /></button>
                  <button className="ib-tool"><Paperclip size={15} /></button>
                  <button className="ib-tool"><Link size={15} /></button>
                  <span className="ib-sep" />
                  <button className="ib-tool"><Bold size={15} /></button>
                  <button className="ib-tool"><Italic size={15} /></button>
                  <button className="ib-tool"><Strikethrough size={15} /></button>
                  <button className="ib-tool"><Code size={15} /></button>
                  <button className="ib-tool"><List size={15} /></button>
                  <button className="ib-tool"><ListOrdered size={15} /></button>
                </div>
                <div className="ib-toolbar-right">
                  <button className="ib-send-btn" onClick={sendReply} disabled={!replyText.trim()}>Send</button>
                  <button className="ib-send-caret"><ChevronDown size={14} /></button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="ib-no-selection">
            <Mail size={48} />
            <h3>Select a conversation</h3>
            <p>Choose a message from the left panel to view its contents</p>
          </div>
        )}
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="ib-right custom-scrollbar">
        {selected && (
          <>
            <h3 className="ib-right-title">Details</h3>
            <div className="ib-details">
              <div className="ib-d-row"><span className="ib-d-label">Type</span><span className="ib-d-value">{selected.type.charAt(0).toUpperCase() + selected.type.slice(1)}</span></div>
              <div className="ib-d-row"><span className="ib-d-label">Priority</span><span className="ib-d-value ib-d-pri">{getPriorityIcon(selected.priority)} {selected.priority.charAt(0).toUpperCase() + selected.priority.slice(1)}</span></div>
              <div className="ib-d-row"><span className="ib-d-label">Project</span><span className="ib-d-value">{selected.project}</span></div>
              <div className="ib-d-row"><span className="ib-d-label">Related to</span><a className="ib-d-link">{selected.relatedTo}</a></div>
              <div className="ib-d-row"><span className="ib-d-label">Status</span><span className={`ib-pill ${getStatusClass(selected.status)}`}>{selected.status}</span></div>
              <div className="ib-d-row"><span className="ib-d-label">Assignee</span><span className="ib-d-value">{selected.assignee}</span></div>
              <div className="ib-d-row"><span className="ib-d-label">Created</span><span className="ib-d-value ib-d-small">{selected.created}</span></div>
            </div>
            <div className="ib-right-section">
              <h3 className="ib-right-title">Thread Actions</h3>
              <button className="ib-d-action" onClick={markUnread}><Mail size={14} /> Mark as unread</button>
              <button className="ib-d-action" onClick={toggleStar}><Star size={14} /> {selected.starred ? 'Remove star' : 'Star conversation'}</button>
              <button className="ib-d-action" onClick={togglePin}><Pin size={14} /> {selected.pinned ? 'Unpin' : 'Pin to top'}</button>
              <button className="ib-d-action" onClick={snoozeMessage}><Clock size={14} /> Snooze</button>
              <button className="ib-d-action" onClick={archiveMessage}><Archive size={14} /> Archive</button>
              <button className="ib-d-action ib-d-danger" onClick={deleteMessage}><Trash2 size={14} /> Delete</button>
            </div>
            <div className="ib-right-section">
              <h3 className="ib-right-title">Shortcuts</h3>
              <div className="ib-shortcut-list">
                <div className="ib-shortcut"><kbd>↑</kbd><kbd>↓</kbd> Navigate</div>
                <div className="ib-shortcut"><kbd>R</kbd> Reply</div>
                <div className="ib-shortcut"><kbd>S</kbd> Star</div>
                <div className="ib-shortcut"><kbd>E</kbd> Archive</div>
                <div className="ib-shortcut"><kbd>Enter</kbd> Send reply</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div className="ib-context-menu" style={{ top: contextMenu.y, left: contextMenu.x }} onClick={e => e.stopPropagation()}>
          <button onClick={() => { markUnread(); setContextMenu(null); }}><Mail size={14} /> Mark as unread</button>
          <button onClick={() => { toggleStar(); setContextMenu(null); }}><Star size={14} /> {selected?.starred ? 'Unstar' : 'Star'}</button>
          <button onClick={() => { togglePin(); setContextMenu(null); }}><Pin size={14} /> {selected?.pinned ? 'Unpin' : 'Pin'}</button>
          <button onClick={() => { snoozeMessage(); setContextMenu(null); }}><Clock size={14} /> Snooze</button>
          <button onClick={() => { archiveMessage(); setContextMenu(null); }}><Archive size={14} /> Archive</button>
          <div className="ib-ctx-sep" />
          <button className="ib-ctx-danger" onClick={() => { deleteMessage(); setContextMenu(null); }}><Trash2 size={14} /> Delete</button>
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && <ComposeModal onClose={() => setShowCompose(false)} onSend={handleComposeSend} />}
    </div>
  );
};
