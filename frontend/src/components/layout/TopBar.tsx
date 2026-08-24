import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Settings, LogOut, MessageSquare, AlertCircle, Menu, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useSidebar } from './Sidebar';
import './TopBar.css';

export const TopBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isDemoMode, signOut } = useAuth();
  const { collapsed, setCollapsed } = useSidebar();
  const navigate = useNavigate();
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button 
          className="hamburger-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={20} color="#6b7280" />
        </button>
        <div className="top-bar-search">
          <Search size={16} className="search-icon" color="#9ca3af" />
          <input type="text" placeholder="Search projects, tasks, teams..." />
          <div className="search-shortcut">⌘ K</div>
        </div>
      </div>
      
      <div className="top-bar-actions">
        
        {/* Notifications Dropdown */}
        <div className="dropdown-container" ref={notifRef}>
          <button 
            className={`icon-btn bell-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} color="#4b5563" />
            <span className="badge">3</span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu notif-menu">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <span className="mark-read">Mark all as read</span>
              </div>
              <div className="dropdown-body">
                <div className="notif-item unread">
                  <div className="notif-icon-wrapper primary"><MessageSquare size={14} /></div>
                  <div className="notif-content">
                    <p><strong>Riya Sharma</strong> commented on your task.</p>
                    <span className="notif-time">2 minutes ago</span>
                  </div>
                </div>
                <div className="notif-item unread">
                  <div className="notif-icon-wrapper warning"><AlertCircle size={14} /></div>
                  <div className="notif-content">
                    <p><strong>Website Redesign</strong> is approaching its deadline.</p>
                    <span className="notif-time">1 hour ago</span>
                  </div>
                </div>
                <div className="notif-item">
                  <div className="notif-icon-wrapper success"><Bell size={14} /></div>
                  <div className="notif-content">
                    <p>System update completed successfully.</p>
                    <span className="notif-time">Yesterday</span>
                  </div>
                </div>
              </div>
              <div className="dropdown-footer">
                <Link to="/activity">View all activity</Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Icon */}
        <button className="icon-btn help-btn">
          <HelpCircle size={20} color="#4b5563" />
        </button>
        
        {/* Profile Dropdown */}
        <div className="dropdown-container" ref={profileRef}>
          <div 
            className={`top-bar-profile ${showProfile ? 'active' : ''}`}
            onClick={() => setShowProfile(!showProfile)}
          >
            <img src={isDemoMode ? "https://i.pravatar.cc/150?u=demo" : "https://i.pravatar.cc/150?u=yug"} alt="User Profile" className="profile-avatar" />
            <div className="profile-info">
              <div className="profile-name">{isDemoMode ? "Guest User" : (user?.email?.split('@')[0] || "Yug Pathak")}</div>
              <div className="profile-role">{isDemoMode ? "Demo Mode" : "Admin"}</div>
            </div>
          </div>

          {showProfile && (
            <div className="dropdown-menu profile-menu">
              <div className="profile-menu-header">
                <p className="profile-menu-name">{isDemoMode ? "Guest User" : (user?.email?.split('@')[0] || "User")}</p>
                <p className="profile-menu-email">{isDemoMode ? "demo@atlas.app" : user?.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/settings" className="dropdown-item">
                <User size={16} /> My Profile
              </Link>
              <Link to="/settings" className="dropdown-item">
                <Settings size={16} /> Account Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={async () => {
                await signOut();
                navigate('/login');
              }}>
                <LogOut size={16} /> Log Out
              </button>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
};
