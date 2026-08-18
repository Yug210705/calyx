import React, { useState, useEffect } from 'react';
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
  ShieldCheck 
} from 'lucide-react';
import './Auth.css';

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDemoMode } = useAuth();
  
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update tab state if URL changes
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const handleTabSwitch = (login: boolean) => {
    setIsLogin(login);
    navigate(login ? '/login' : '/register');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setDemoMode(false);
        navigate('/');
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + '/login' }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        navigate('/verify-email');
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

        <img 
          src="/atlas_dashboard_mockup.jpg" 
          alt="Atlas Dashboard" 
          className="auth-dashboard-mockup"
        />

        <div className="auth-features-grid">
          <div className="auth-feature">
            <div className="auth-feature-icon">
              <Shield size={18} />
            </div>
            <div className="auth-feature-title">Enterprise Ready</div>
            <div className="auth-feature-desc">Built with security, scalability and reliability in mind.</div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">
              <Users size={18} />
            </div>
            <div className="auth-feature-title">Team Collaboration</div>
            <div className="auth-feature-desc">Bring your teams together and get work done.</div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">
              <BarChart size={18} />
            </div>
            <div className="auth-feature-title">Real-time Insights</div>
            <div className="auth-feature-desc">Track progress with powerful reports and dashboards.</div>
          </div>
          <div className="auth-feature">
            <div className="auth-feature-icon">
              <Puzzle size={18} />
            </div>
            <div className="auth-feature-title">Seamless Integrations</div>
            <div className="auth-feature-desc">Connect your favorite tools and automate workflows.</div>
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
          <button className="auth-language-selector">
            <Globe size={16} />
            English
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="auth-right-content">
          <div className="auth-form-container">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => handleTabSwitch(true)}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => handleTabSwitch(false)}
              >
                Create Account
              </button>
            </div>

            <div className="auth-form-header">
              <h2>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
              <p>{isLogin ? 'Sign in to continue to Atlas' : 'Start your 14-day free trial today'}</p>
            </div>

            {error && <div className="auth-error-msg">{error}</div>}

            <div className="auth-social-buttons">
              <button className="auth-social-btn" type="button" onClick={() => navigate('/')}>
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Continue with Google
              </button>
              <button className="auth-social-btn" type="button" onClick={() => navigate('/')}>
                <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" />
                Continue with Microsoft
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
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <Lock className="auth-input-icon" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="auth-input-action"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="auth-form-options">
                  <label className="auth-checkbox-group">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="auth-link">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
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
            
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
               <span className="auth-link" style={{fontSize: '0.85rem'}} onClick={() => { setDemoMode(true); navigate('/'); }}>Explore Demo Mode</span>
            </div>

          </div>

          <div className="auth-info-panel">
            <img src="/atlas_auth_illustration.jpg" alt="Analytics Illustration" className="auth-illustration" />
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
