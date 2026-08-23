import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../services/AuthContext';
import { 
  Hexagon, 
  Shield, 
  Users, 
  BarChart, 
  Puzzle, 
  Globe, 
  ChevronDown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck,
  Layout,
  TrendingUp,
  PieChart,
  Activity
} from 'lucide-react';
import './Auth.css';

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDemoMode } = useAuth();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Dropdown state
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update tab state if URL changes
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const handleTabSwitch = (login: boolean) => {
    setIsLogin(login);
    navigate(login ? '/login' : '/register');
    setError('');
    setMessage('');
    setOtpSent(false);
  };

  const handleOAuth = async (provider: 'google' | 'azure') => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/'
      }
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!otpSent) {
      // Step 1: Send OTP code
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          shouldCreateUser: true // Allows both login and signup
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        setOtpSent(true);
        setMessage('A 6-digit verification code has been sent to your email.');
      }
      setLoading(false);
    } else {
      // Step 2: Verify OTP code
      const { error } = await supabase.auth.verifyOtp({ 
        email, 
        token: otpCode, 
        type: 'email' 
      });
      
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setDemoMode(false);
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-page-container">
      
      {/* LEFT PANEL */}
      <div className="auth-left-panel">
        <div className="auth-left-header">
          <Hexagon className="auth-logo-icon" size={32} />
          <span className="auth-logo-text">atlas</span>
        </div>
        
        <h1 className="auth-hero-title">
          One workspace.<br />
          Every team. <span className="auth-hero-highlight">All aligned.</span>
        </h1>
        
        <p className="auth-hero-subtitle">
          Atlas helps modern teams plan, track, and deliver work that drives real impact.
        </p>

        {/* Pure CSS Premium Dashboard Mockup */}
        <div className="css-dashboard-mockup">
          <div className="css-dash-header">
            <div className="css-dash-greeting">
              <Hexagon size={16} color="#7b61ff" />
              <span>Good morning, Yug! 👋</span>
            </div>
            <div className="css-dash-search">
              <div className="css-dash-search-bar"></div>
            </div>
          </div>
          
          <div className="css-dash-metrics">
            <div className="css-dash-card">
              <div className="css-dash-card-title">Total Projects</div>
              <div className="css-dash-card-value">24</div>
              <div className="css-dash-card-trend positive">↑ 14%</div>
            </div>
            <div className="css-dash-card">
              <div className="css-dash-card-title">Tasks Completed</div>
              <div className="css-dash-card-value">342</div>
              <div className="css-dash-card-trend positive">↑ 18%</div>
            </div>
            <div className="css-dash-card">
              <div className="css-dash-card-title">Hours</div>
              <div className="css-dash-card-value">1,284h</div>
              <div className="css-dash-card-trend positive">↑ 9%</div>
            </div>
            <div className="css-dash-card">
              <div className="css-dash-card-title">Active Members</div>
              <div className="css-dash-card-value">112</div>
              <div className="css-dash-card-trend positive">↑ 7%</div>
            </div>
          </div>
          
          <div className="css-dash-charts">
             <div className="css-dash-chart-main">
                <div className="css-dash-chart-title">Projects Overview</div>
                <div className="css-dash-line-chart">
                   <svg viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,25 Q10,20 20,25 T40,15 T60,20 T80,5 T100,10" fill="none" stroke="#7b61ff" strokeWidth="2" />
                      <circle cx="80" cy="5" r="2" fill="#7b61ff" />
                      <circle cx="40" cy="15" r="2" fill="#7b61ff" />
                   </svg>
                </div>
             </div>
             <div className="css-dash-chart-side">
                <div className="css-dash-chart-title">Tasks by Status</div>
                <div className="css-dash-pie-chart">
                   <div className="css-pie-circle">
                      <span>342</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="auth-testimonial">
          <span className="auth-quote-icon" style={{fontSize: '2rem', lineHeight: '0.8'}}>&#8220;</span>
          <div className="auth-quote-text">
            Atlas has transformed the way our teams collaborate and deliver.
          </div>
          <div className="auth-quote-author">
            <img src="https://i.pravatar.cc/150?u=priya" alt="Priya Sharma" className="auth-author-avatar" />
            <div className="auth-author-info">
              <h4>Priya Sharma</h4>
              <p>Product Manager at Acme Corp</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right-panel">
        
        <div className="auth-right-header">
          <div className="lang-dropdown-wrapper" ref={langRef}>
            <button 
              className="auth-language-selector"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              <Globe size={16} />
              English
              <ChevronDown size={14} />
            </button>
            {showLangDropdown && (
              <div className="lang-dropdown-menu">
                <div className="lang-item active">English</div>
                <div className="lang-item">Español</div>
                <div className="lang-item">Français</div>
                <div className="lang-item">Deutsch</div>
              </div>
            )}
          </div>
        </div>

        <div className="auth-right-content">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
              <p>{isLogin ? 'Sign in to continue to Atlas' : 'Start your 14-day free trial today'}</p>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}
            {message && <div className="auth-error-msg" style={{backgroundColor: '#ecfdf5', color: '#065f46'}}>{message}</div>}

            <div className="auth-social-buttons">
              <button className="auth-social-btn" type="button" onClick={() => handleOAuth('google')}>
                <img src="https://www.google.com/favicon.ico" alt="Google" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                Continue with Google
              </button>
              <button className="auth-social-btn" type="button" onClick={() => handleOAuth('azure')}>
                <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                Continue with Microsoft
              </button>
              <button className="auth-social-btn guest-btn" type="button" onClick={() => { setDemoMode(true); navigate('/'); }}>
                <Eye size={18} />
                Continue as Guest
              </button>
            </div>

            <div className="auth-divider">OR</div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-input-group">
                <label>Email address</label>
                <div className="auth-input-wrapper">
                  <Mail className="auth-input-icon" size={18} />
                  <input 
                    type="email" 
                    className="auth-input" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={otpSent}
                  />
                </div>
              </div>

              {otpSent && (
                <div className="auth-input-group">
                  <label>Verification Code</label>
                  <div className="auth-input-wrapper">
                    <Lock className="auth-input-icon" size={18} />
                    <input 
                      type="text"
                      className="auth-input" 
                      placeholder="Enter 6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Please wait...' : (otpSent ? 'Verify Code' : 'Send Code')}
              </button>
              
              {!isLogin && (
                <p style={{fontSize: '0.85rem', color: 'var(--auth-text-dark-muted)', textAlign: 'center'}}>
                  By creating an account, you agree to our <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a>.
                </p>
              )}
            </form>

            <div className="auth-security-badge">
              <ShieldCheck size={16} />
              Your data is protected with enterprise-grade security
            </div>

            <div className="auth-footer-text">
              {isLogin ? (
                <>Don't have an account? <span className="auth-link" onClick={() => handleTabSwitch(false)}>Create account</span></>
              ) : (
                <>Already have an account? <span className="auth-link" onClick={() => handleTabSwitch(true)}>Sign in</span></>
              )}
            </div>
          </div>

          <div className="auth-info-panel">
            
            {/* Pure CSS 3D-ish Illustration */}
            <div className="css-illustration-wrapper">
               <div className="css-ill-card css-ill-card-1">
                  <div className="css-ill-header">
                    <Activity size={16} color="#7b61ff" />
                    <div className="css-ill-line" style={{width: '60px'}}></div>
                  </div>
                  <div className="css-ill-chart-bars">
                    <div className="css-ill-bar" style={{height: '40%'}}></div>
                    <div className="css-ill-bar" style={{height: '70%'}}></div>
                    <div className="css-ill-bar" style={{height: '50%'}}></div>
                    <div className="css-ill-bar" style={{height: '90%'}}></div>
                    <div className="css-ill-bar" style={{height: '60%'}}></div>
                  </div>
               </div>
               
               <div className="css-ill-card css-ill-card-2">
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="css-ill-avatar" />
                  <div className="css-ill-name">Sarah Jenkins</div>
                  <div className="css-ill-role">Product Designer</div>
                  <div className="css-ill-stats">
                     <div className="css-ill-stat"><div className="css-ill-stat-val">14</div><div className="css-ill-stat-lbl">Projects</div></div>
                     <div className="css-ill-stat"><div className="css-ill-stat-val">82</div><div className="css-ill-stat-lbl">Tasks</div></div>
                  </div>
               </div>
               
               <div className="css-ill-card css-ill-card-3">
                  <PieChart size={24} color="#0ea5e9" />
                  <div style={{marginTop: '10px'}}>
                     <div className="css-ill-line" style={{width: '100%', marginBottom: '4px'}}></div>
                     <div className="css-ill-line" style={{width: '70%', marginBottom: '4px'}}></div>
                     <div className="css-ill-line" style={{width: '40%'}}></div>
                  </div>
               </div>
               
               <div className="css-ill-blob"></div>
            </div>

            <h3 className="auth-info-title">Why teams love Atlas</h3>
            <div className="auth-info-list">
              <div className="auth-info-item">
                <CheckCircle2 className="auth-info-icon" size={20} />
                <span className="auth-info-text">All-in-one workspace for projects, tasks, and teams</span>
              </div>
              <div className="auth-info-item">
                <CheckCircle2 className="auth-info-icon" size={20} />
                <span className="auth-info-text">Powerful reporting and real-time analytics</span>
              </div>
              <div className="auth-info-item">
                <CheckCircle2 className="auth-info-icon" size={20} />
                <span className="auth-info-text">Role-based access and advanced permissions</span>
              </div>
              <div className="auth-info-item">
                <CheckCircle2 className="auth-info-icon" size={20} />
                <span className="auth-info-text">Secure, compliant, and built for enterprise</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
