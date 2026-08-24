import React, { useState } from 'react';
import {
  Bell,
  AtSign,
  ClipboardList,
  CheckCircle,
  MessageSquare,
  Server,
  Check,
  X,
  MoreVertical,
  Reply,
  ExternalLink,
  Eye,
  GitPullRequest
} from 'lucide-react';
import './Inbox.css';

type NotificationType = 'mention' | 'assignment' | 'approval' | 'comment' | 'system';

interface NotificationAction {
  label: string;
  icon?: React.ReactNode;
  variant: 'primary' | 'secondary' | 'success';
}

interface Notification {
  id: string;
  type: NotificationType;
  title: React.ReactNode;
  body?: string;
  quote?: string;
  timestamp: string;
  isRead: boolean;
  avatarUrl?: string;
  projectContext?: string;
  actions?: NotificationAction[];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'approval',
    title: <span><strong>Sarah Jenkins</strong> requested your approval on PR <strong>#4192: Refactor auth flow</strong></span>,
    body: 'The new OAuth2 implementation is ready for review. All integration tests are passing in CI.',
    timestamp: '10m ago',
    isRead: false,
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    actions: [
      { label: 'Approve', variant: 'success', icon: <Check size={16} /> },
      { label: 'View PR', variant: 'secondary', icon: <GitPullRequest size={16} /> }
    ]
  },
  {
    id: '2',
    type: 'mention',
    title: <span><strong>David Chen</strong> mentioned you in <strong>PROJ-892: Update billing schemas</strong></span>,
    quote: '@yug Can you confirm if we still need the legacy customer_id field in the new payload?',
    timestamp: '1h ago',
    isRead: false,
    avatarUrl: 'https://i.pravatar.cc/150?u=david',
    actions: [
      { label: 'Reply', variant: 'primary', icon: <Reply size={16} /> },
      { label: 'Open Issue', variant: 'secondary', icon: <ExternalLink size={16} /> }
    ]
  },
  {
    id: '3',
    type: 'assignment',
    title: <span>You were assigned to <strong>INFRA-102: Migrate Redis clusters</strong></span>,
    body: 'Priority changed to HIGH. Due date set for Friday.',
    timestamp: '2h ago',
    isRead: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=alex', // assigned by
    actions: [
      { label: 'View Task', variant: 'secondary', icon: <Eye size={16} /> }
    ]
  },
  {
    id: '4',
    type: 'system',
    title: <span><strong>Production Deployment</strong> completed successfully</span>,
    body: 'Release v2.14.0 has been deployed to the eu-west-1 cluster. 4 pods updated.',
    timestamp: '4h ago',
    isRead: true,
    actions: [
      { label: 'View Logs', variant: 'secondary' }
    ]
  },
  {
    id: '5',
    type: 'comment',
    title: <span><strong>Emily Wong</strong> commented on <strong>Design Spec: Q4 Roadmap</strong></span>,
    quote: 'I think we should prioritize the dashboard overhaul before tackling the reporting engine.',
    timestamp: '1d ago',
    isRead: true,
    avatarUrl: 'https://i.pravatar.cc/150?u=emily',
    actions: [
      { label: 'Reply', variant: 'secondary', icon: <Reply size={16} /> }
    ]
  }
];

const filters = [
  { id: 'all', label: 'All Notifications', icon: <Bell size={18} /> },
  { id: 'mention', label: 'Mentions', icon: <AtSign size={18} /> },
  { id: 'assignment', label: 'Assignments', icon: <ClipboardList size={18} /> },
  { id: 'approval', label: 'Approvals', icon: <CheckCircle size={18} /> },
  { id: 'comment', label: 'Comments', icon: <MessageSquare size={18} /> },
  { id: 'system', label: 'System Alerts', icon: <Server size={18} /> },
];

export const Inbox = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filteredNotifications = notifications.filter(
    (n) => activeFilter === 'all' || n.type === activeFilter
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'mention': return <AtSign size={12} />;
      case 'assignment': return <ClipboardList size={12} />;
      case 'approval': return <CheckCircle size={12} />;
      case 'comment': return <MessageSquare size={12} />;
      case 'system': return <Server size={12} />;
    }
  };

  return (
    <div className="inbox-container">
      {/* Sidebar */}
      <aside className="inbox-sidebar">
        <div className="inbox-sidebar-title">
          <Bell size={20} />
          Inbox
        </div>
        <nav className="inbox-sidebar-nav">
          {filters.map((filter) => {
            const count = filter.id === 'all' 
              ? unreadCount 
              : notifications.filter(n => n.type === filter.id && !n.isRead).length;

            return (
              <button
                key={filter.id}
                className={`inbox-nav-item ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <div className="nav-item-left">
                  <span className="nav-item-icon">{filter.icon}</span>
                  <span>{filter.label}</span>
                </div>
                {count > 0 && (
                  <span className="nav-item-badge">{count}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="inbox-main">
        <header className="inbox-header">
          <h2>{filters.find(f => f.id === activeFilter)?.label || 'Inbox'}</h2>
          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="btn-mark-read" onClick={markAllAsRead}>
                <Check size={16} />
                Mark all as read
              </button>
            )}
          </div>
        </header>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="inbox-empty">
              <CheckCircle />
              <h3>All caught up!</h3>
              <p>You have no notifications in this view.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
              >
                <div className="notification-avatar">
                  {notification.avatarUrl ? (
                    <img src={notification.avatarUrl} alt="Avatar" className="avatar-img" />
                  ) : (
                    <div className="avatar-icon-wrapper">
                      <Server size={24} />
                    </div>
                  )}
                  <div className={`notification-type-icon ${notification.type}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                </div>

                <div className="notification-content">
                  <div className="notification-header">
                    <p className="notification-title">{notification.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="notification-time">{notification.timestamp}</span>
                      <button className="notification-menu">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {notification.body && (
                    <p className="notification-body">{notification.body}</p>
                  )}

                  {notification.quote && (
                    <blockquote className="notification-body quote">
                      {notification.quote}
                    </blockquote>
                  )}

                  {notification.actions && notification.actions.length > 0 && (
                    <div className="notification-actions">
                      {notification.actions.map((action, i) => (
                        <button 
                          key={i}
                          className={`btn-action btn-action-${action.variant}`}
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
