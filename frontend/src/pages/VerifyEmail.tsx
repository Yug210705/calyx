import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Hexagon } from 'lucide-react';
import './Auth.css';

export const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-header">
          <div className="auth-logo" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Mail size={28} />
          </div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle" style={{ marginTop: '12px', lineHeight: '1.5' }}>
            We've sent a verification link to your email address. 
            Please click the link to activate your account and access your workspace.
          </p>
        </div>

        <button 
          onClick={() => navigate('/login')} 
          className="demo-btn" 
          style={{ marginTop: '8px' }}
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};
