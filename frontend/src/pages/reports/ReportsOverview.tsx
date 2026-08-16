import React from 'react';
import '../Reports.css';
import { 
  Folder, 
  CheckCircle2, 
  Clock, 
  Users, 
  ChevronDown, 
  Info, 
  Target, 
  Timer, 
  Download, 
  FileText, 
  ArrowRight 
} from 'lucide-react';

export const ReportsOverview = () => {
  return (
        <div className="rpt-content-layout">
        {/* LEFT MAIN AREA */}
        <div className="rpt-main-area">
          {/* KPI CARDS ROW */}
          <div className="rpt-kpi-row">
            {/* Card 1 */}
            <div className="rpt-kpi-card">
              <div className="rpt-kpi-icon-box rpt-icon-purple">
                <Folder size={20} />
              </div>
              <span className="rpt-kpi-label">Total Projects</span>
              <div className="rpt-kpi-value-row">
                <span className="rpt-kpi-value">24</span>
                <div className="rpt-kpi-trend">
                  <span className="rpt-trend-arrow">↑ 14%</span>
                  <span className="rpt-trend-vs">vs last month</span>
                </div>
              </div>
              <svg className="rpt-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none">
                <polyline points="0,20 12,16 25,18 38,14 50,16 62,10 75,12 88,6 100,4" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="0" cy="20" r="1.5" fill="#7c3aed" /><circle cx="12" cy="16" r="1.5" fill="#7c3aed" /><circle cx="25" cy="18" r="1.5" fill="#7c3aed" /><circle cx="38" cy="14" r="1.5" fill="#7c3aed" /><circle cx="50" cy="16" r="1.5" fill="#7c3aed" /><circle cx="62" cy="10" r="1.5" fill="#7c3aed" /><circle cx="75" cy="12" r="1.5" fill="#7c3aed" /><circle cx="88" cy="6" r="1.5" fill="#7c3aed" /><circle cx="100" cy="4" r="1.5" fill="#7c3aed" />
              </svg>
            </div>
            
            {/* Card 2 */}
            <div className="rpt-kpi-card">
              <div className="rpt-kpi-icon-box rpt-icon-green">
                <CheckCircle2 size={20} />
              </div>
              <span className="rpt-kpi-label">Tasks Completed</span>
              <div className="rpt-kpi-value-row">
                <span className="rpt-kpi-value">342</span>
                <div className="rpt-kpi-trend">
                  <span className="rpt-trend-arrow">↑ 18%</span>
                  <span className="rpt-trend-vs">vs last month</span>
                </div>
              </div>
              <svg className="rpt-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none">
                <polyline points="0,22 12,18 25,20 38,14 50,12 62,16 75,8 88,6 100,2" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="0" cy="22" r="1.5" fill="#16a34a" /><circle cx="12" cy="18" r="1.5" fill="#16a34a" /><circle cx="25" cy="20" r="1.5" fill="#16a34a" /><circle cx="38" cy="14" r="1.5" fill="#16a34a" /><circle cx="50" cy="12" r="1.5" fill="#16a34a" /><circle cx="62" cy="16" r="1.5" fill="#16a34a" /><circle cx="75" cy="8" r="1.5" fill="#16a34a" /><circle cx="88" cy="6" r="1.5" fill="#16a34a" /><circle cx="100" cy="2" r="1.5" fill="#16a34a" />
              </svg>
            </div>

            {/* Card 3 */}
            <div className="rpt-kpi-card">
              <div className="rpt-kpi-icon-box rpt-icon-orange">
                <Clock size={20} />
              </div>
              <span className="rpt-kpi-label">Hours Tracked</span>
              <div className="rpt-kpi-value-row">
                <span className="rpt-kpi-value">1,284h</span>
                <div className="rpt-kpi-trend">
                  <span className="rpt-trend-arrow">↑ 9%</span>
                  <span className="rpt-trend-vs">vs last month</span>
                </div>
              </div>
              <svg className="rpt-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none">
                <polyline points="0,16 12,18 25,12 38,20 50,14 62,10 75,16 88,8 100,6" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="0" cy="16" r="1.5" fill="#ea580c" /><circle cx="12" cy="18" r="1.5" fill="#ea580c" /><circle cx="25" cy="12" r="1.5" fill="#ea580c" /><circle cx="38" cy="20" r="1.5" fill="#ea580c" /><circle cx="50" cy="14" r="1.5" fill="#ea580c" /><circle cx="62" cy="10" r="1.5" fill="#ea580c" /><circle cx="75" cy="16" r="1.5" fill="#ea580c" /><circle cx="88" cy="8" r="1.5" fill="#ea580c" /><circle cx="100" cy="6" r="1.5" fill="#ea580c" />
              </svg>
            </div>

            {/* Card 4 */}
            <div className="rpt-kpi-card">
              <div className="rpt-kpi-icon-box rpt-icon-blue">
                <Users size={20} />
              </div>
              <span className="rpt-kpi-label">Active Members</span>
              <div className="rpt-kpi-value-row">
                <span className="rpt-kpi-value">112</span>
                <div className="rpt-kpi-trend">
                  <span className="rpt-trend-arrow">↑ 7%</span>
                  <span className="rpt-trend-vs">vs last month</span>
                </div>
              </div>
              <svg className="rpt-sparkline" viewBox="0 0 100 24" preserveAspectRatio="none">
                <polyline points="0,14 12,12 25,16 38,10 50,14 62,8 75,12 88,6 100,4" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="0" cy="14" r="1.5" fill="#0284c7" /><circle cx="12" cy="12" r="1.5" fill="#0284c7" /><circle cx="25" cy="16" r="1.5" fill="#0284c7" /><circle cx="38" cy="10" r="1.5" fill="#0284c7" /><circle cx="50" cy="14" r="1.5" fill="#0284c7" /><circle cx="62" cy="8" r="1.5" fill="#0284c7" /><circle cx="75" cy="12" r="1.5" fill="#0284c7" /><circle cx="88" cy="6" r="1.5" fill="#0284c7" /><circle cx="100" cy="4" r="1.5" fill="#0284c7" />
              </svg>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="rpt-charts-row">
            {/* Tasks Overview */}
            <div className="rpt-card rpt-tasks-overview">
              <div className="rpt-card-header">
                <h3 className="rpt-card-title">Tasks Overview</h3>
                <div className="rpt-dropdown">
                  Daily <ChevronDown size={14} />
                </div>
              </div>
              <div className="rpt-legend">
                <span className="rpt-legend-item"><span className="rpt-dot rpt-dot-green"></span> Completed</span>
                <span className="rpt-legend-item"><span className="rpt-dot rpt-dot-blue"></span> In Progress</span>
                <span className="rpt-legend-item"><span className="rpt-dot rpt-dot-grey"></span> To Do</span>
                <span className="rpt-legend-item"><span className="rpt-dot rpt-dot-red"></span> Blocked</span>
              </div>
              <div className="rpt-bar-chart">
                <div className="rpt-y-axis">
                  <span>250</span><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
                </div>
                <div className="rpt-bar-chart-bars">
                  {/* May 13 - 20 bars mock data */}
                  {[
                    { hG: '30%', hB: '20%', hGr: '40%', hR: '10%' },
                    { hG: '40%', hB: '25%', hGr: '30%', hR: '5%' },
                    { hG: '45%', hB: '20%', hGr: '25%', hR: '10%' },
                    { hG: '50%', hB: '15%', hGr: '25%', hR: '10%' },
                    { hG: '60%', hB: '15%', hGr: '20%', hR: '5%' },
                    { hG: '35%', hB: '35%', hGr: '20%', hR: '10%' },
                    { hG: '40%', hB: '30%', hGr: '25%', hR: '5%' },
                    { hG: '55%', hB: '20%', hGr: '20%', hR: '5%' },
                  ].map((bar, i) => (
                    <div key={i} className="rpt-bar-group">
                      <div className="rpt-bar">
                        <div className="rpt-bar-segment rpt-bg-red" style={{ height: bar.hR }}></div>
                        <div className="rpt-bar-segment rpt-bg-grey" style={{ height: bar.hGr }}></div>
                        <div className="rpt-bar-segment rpt-bg-blue" style={{ height: bar.hB }}></div>
                        <div className="rpt-bar-segment rpt-bg-green" style={{ height: bar.hG }}></div>
                      </div>
                      <span className="rpt-x-label">May {13 + i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Progress */}
            <div className="rpt-card rpt-projects-progress">
              <div className="rpt-card-header">
                <h3 className="rpt-card-title">Projects Progress</h3>
                <div className="rpt-dropdown">
                  By Status <ChevronDown size={14} />
                </div>
              </div>
              <div className="rpt-donut-container">
                <div className="rpt-donut-chart">
                  <div className="rpt-donut-hole">
                    <span className="rpt-donut-val">24</span>
                    <span className="rpt-donut-label">Total Projects</span>
                  </div>
                </div>
                <div className="rpt-donut-legend">
                  <div className="rpt-donut-legend-item">
                    <span className="rpt-dot rpt-dot-green"></span>
                    <div className="rpt-donut-legend-text">
                      <span className="rpt-donut-status">On Track</span>
                      <span className="rpt-donut-stats">10 (41.7%)</span>
                    </div>
                  </div>
                  <div className="rpt-donut-legend-item">
                    <span className="rpt-dot rpt-dot-orange"></span>
                    <div className="rpt-donut-legend-text">
                      <span className="rpt-donut-status">At Risk</span>
                      <span className="rpt-donut-stats">6 (25.0%)</span>
                    </div>
                  </div>
                  <div className="rpt-donut-legend-item">
                    <span className="rpt-dot rpt-dot-red"></span>
                    <div className="rpt-donut-legend-text">
                      <span className="rpt-donut-status">Behind</span>
                      <span className="rpt-donut-stats">4 (16.7%)</span>
                    </div>
                  </div>
                  <div className="rpt-donut-legend-item">
                    <span className="rpt-dot rpt-dot-grey"></span>
                    <div className="rpt-donut-legend-text">
                      <span className="rpt-donut-status">Not Started</span>
                      <span className="rpt-donut-stats">4 (16.6%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="rpt-bottom-row">
            {/* Team Workload */}
            <div className="rpt-card rpt-team-workload">
              <div className="rpt-card-header">
                <h3 className="rpt-card-title">Team Workload</h3>
                <div className="rpt-dropdown">
                  All Teams <ChevronDown size={14} />
                </div>
              </div>
              <table className="rpt-workload-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Members</th>
                    <th>Tasks</th>
                    <th>Completed</th>
                    <th>Workload</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="rpt-team-cell">
                        <span className="rpt-team-badge rpt-badge-purple">ENG</span>
                        <div className="rpt-team-details">
                          <span className="rpt-team-name">Engineering</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rpt-avatars">
                        <img src="https://i.pravatar.cc/150?u=1" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=2" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=3" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=4" alt="avatar" />
                        <span className="rpt-avatar-more">+2</span>
                      </div>
                    </td>
                    <td>128</td>
                    <td>
                      <div className="rpt-progress-cell">
                        <span>76 (51%)</span>
                        <div className="rpt-progress-bar-bg"><div className="rpt-progress-bar-fill rpt-bg-purple" style={{width: '51%'}}></div></div>
                      </div>
                    </td>
                    <td><span className="rpt-status-badge rpt-status-red">High</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="rpt-team-cell">
                        <span className="rpt-team-badge rpt-badge-blue">PRD</span>
                        <div className="rpt-team-details">
                          <span className="rpt-team-name">Product</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rpt-avatars">
                        <img src="https://i.pravatar.cc/150?u=5" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=6" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=7" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=8" alt="avatar" />
                        <span className="rpt-avatar-more">+1</span>
                      </div>
                    </td>
                    <td>86</td>
                    <td>
                      <div className="rpt-progress-cell">
                        <span>52 (50%)</span>
                        <div className="rpt-progress-bar-bg"><div className="rpt-progress-bar-fill rpt-bg-blue" style={{width: '50%'}}></div></div>
                      </div>
                    </td>
                    <td><span className="rpt-status-badge rpt-status-yellow">Medium</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="rpt-team-cell">
                        <span className="rpt-team-badge rpt-badge-pink">DSN</span>
                        <div className="rpt-team-details">
                          <span className="rpt-team-name">Design</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rpt-avatars">
                        <img src="https://i.pravatar.cc/150?u=9" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=10" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=11" alt="avatar" />
                      </div>
                    </td>
                    <td>56</td>
                    <td>
                      <div className="rpt-progress-cell">
                        <span>34 (51%)</span>
                        <div className="rpt-progress-bar-bg"><div className="rpt-progress-bar-fill rpt-bg-pink" style={{width: '51%'}}></div></div>
                      </div>
                    </td>
                    <td><span className="rpt-status-badge rpt-status-yellow">Medium</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="rpt-team-cell">
                        <span className="rpt-team-badge rpt-badge-green">QA</span>
                        <div className="rpt-team-details">
                          <span className="rpt-team-name">QA</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rpt-avatars">
                        <img src="https://i.pravatar.cc/150?u=12" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=13" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=14" alt="avatar" />
                        <span className="rpt-avatar-more">+1</span>
                      </div>
                    </td>
                    <td>42</td>
                    <td>
                      <div className="rpt-progress-cell">
                        <span>28 (67%)</span>
                        <div className="rpt-progress-bar-bg"><div className="rpt-progress-bar-fill rpt-bg-green" style={{width: '67%'}}></div></div>
                      </div>
                    </td>
                    <td><span className="rpt-status-badge rpt-status-green">Low</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="rpt-team-cell">
                        <span className="rpt-team-badge rpt-badge-purple">MKT</span>
                        <div className="rpt-team-details">
                          <span className="rpt-team-name">Marketing</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="rpt-avatars">
                        <img src="https://i.pravatar.cc/150?u=15" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=16" alt="avatar" />
                        <img src="https://i.pravatar.cc/150?u=17" alt="avatar" />
                      </div>
                    </td>
                    <td>30</td>
                    <td>
                      <div className="rpt-progress-cell">
                        <span>18 (60%)</span>
                        <div className="rpt-progress-bar-bg"><div className="rpt-progress-bar-fill rpt-bg-purple" style={{width: '60%'}}></div></div>
                      </div>
                    </td>
                    <td><span className="rpt-status-badge rpt-status-green">Low</span></td>
                  </tr>
                </tbody>
              </table>
              <div className="rpt-card-footer">
                <a href="#" className="rpt-footer-link">View full workload report <ArrowRight size={14} /></a>
              </div>
            </div>

            {/* Tasks Completed Over Time */}
            <div className="rpt-card rpt-tasks-over-time">
              <div className="rpt-card-header">
                <h3 className="rpt-card-title">Tasks Completed</h3>
                <div className="rpt-dropdown">
                  Weekly <ChevronDown size={14} />
                </div>
              </div>
              <div className="rpt-line-chart-container">
                <div className="rpt-y-axis">
                  <span>250</span><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span>
                </div>
                <div className="rpt-line-chart-area">
                  <svg className="rpt-line-chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(124, 58, 237, 0.2)" />
                        <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    {[0, 40, 80, 120, 160].map(y => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    ))}
                    <line x1="0" y1="200" x2="400" y2="200" stroke="#e2e8f0" strokeWidth="1" />

                    {/* Path */}
                    <path d="M 0,200 L 0,86.4 L 133,65.6 L 266,48.8 L 400,21.6 L 400,200 Z" fill="url(#purpleArea)" />
                    <polyline points="0,86.4 133,65.6 266,48.8 400,21.6" fill="none" stroke="#7C3AED" strokeWidth="2" />
                    
                    {/* Dots */}
                    <circle cx="0" cy="86.4" r="4" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
                    <circle cx="133" cy="65.6" r="4" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
                    <circle cx="266" cy="48.8" r="4" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
                    <circle cx="400" cy="21.6" r="4" fill="#fff" stroke="#7C3AED" strokeWidth="2" />
                  </svg>
                  <div className="rpt-x-axis">
                    <span>Apr 28</span>
                    <span>May 5</span>
                    <span>May 12</span>
                    <span>May 20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="rpt-sidebar">
          {/* Panel 1: Report Summary */}
          <div className="rpt-card rpt-summary-panel">
            <div className="rpt-card-header">
              <h3 className="rpt-card-title">Report Summary <Info size={14} className="rpt-info-icon" /></h3>
            </div>
            <p className="rpt-summary-subtext">Data compared to Apr 29 - May 12, 2024</p>
            <div className="rpt-summary-metrics">
              <div className="rpt-summary-metric">
                <div className="rpt-summary-metric-left">
                  <CheckCircle2 size={18} className="rpt-metric-icon rpt-text-green" />
                  <span>Projects Completed</span>
                </div>
                <div className="rpt-summary-metric-right">
                  <span className="rpt-metric-val">8</span>
                  <span className="rpt-metric-trend">↑ 33%</span>
                </div>
              </div>
              <div className="rpt-summary-metric">
                <div className="rpt-summary-metric-left">
                  <Clock size={18} className="rpt-metric-icon rpt-text-orange" />
                  <span>Overdue Tasks</span>
                </div>
                <div className="rpt-summary-metric-right">
                  <span className="rpt-metric-val">27</span>
                  <span className="rpt-metric-trend">↑ 12%</span>
                </div>
              </div>
              <div className="rpt-summary-metric">
                <div className="rpt-summary-metric-left">
                  <Timer size={18} className="rpt-metric-icon rpt-text-blue" />
                  <span>Avg. Task Completion Time</span>
                </div>
                <div className="rpt-summary-metric-right">
                  <span className="rpt-metric-val">2.8 days</span>
                  <span className="rpt-metric-trend">↑ 8%</span>
                </div>
              </div>
              <div className="rpt-summary-metric">
                <div className="rpt-summary-metric-left">
                  <Target size={18} className="rpt-metric-icon rpt-text-purple" />
                  <span>On-time Delivery</span>
                </div>
                <div className="rpt-summary-metric-right">
                  <span className="rpt-metric-val">89%</span>
                  <span className="rpt-metric-trend">↑ 6%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Top Performing Teams */}
          <div className="rpt-card rpt-teams-panel">
            <div className="rpt-card-header">
              <h3 className="rpt-card-title">Top Performing Teams</h3>
              <div className="rpt-dropdown">
                By Completed Tasks <ChevronDown size={14} />
              </div>
            </div>
            <div className="rpt-teams-list">
              {[
                { name: 'Engineering', val: 128, p: '100%' },
                { name: 'Product', val: 86, p: '67%' },
                { name: 'Design', val: 56, p: '43%' },
                { name: 'QA', val: 42, p: '32%' },
                { name: 'Marketing', val: 30, p: '23%' }
              ].map((team, idx) => (
                <div key={idx} className="rpt-team-rank">
                  <div className="rpt-team-rank-header">
                    <span>{idx + 1}. {team.name}</span>
                    <span className="rpt-team-rank-val">{team.val}</span>
                  </div>
                  <div className="rpt-team-rank-bar-bg">
                    <div className="rpt-team-rank-bar-fill" style={{ width: team.p }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rpt-card-footer">
              <a href="#" className="rpt-footer-link">View full report <ArrowRight size={14} /></a>
            </div>
          </div>

          {/* Panel 3: Recent Reports */}
          <div className="rpt-card rpt-recent-panel">
            <div className="rpt-card-header">
              <h3 className="rpt-card-title">Recent Reports</h3>
            </div>
            <div className="rpt-recent-list">
              <div className="rpt-recent-item">
                <div className="rpt-recent-icon-box rpt-bg-light-blue">
                  <FileText size={18} className="rpt-text-blue" />
                </div>
                <div className="rpt-recent-details">
                  <span className="rpt-recent-name">Project Progress Report</span>
                  <span className="rpt-recent-date">Generated on May 20, 2024</span>
                </div>
                <button className="rpt-download-btn"><Download size={16} /></button>
              </div>
              <div className="rpt-recent-item">
                <div className="rpt-recent-icon-box rpt-bg-light-green">
                  <FileText size={18} className="rpt-text-green" />
                </div>
                <div className="rpt-recent-details">
                  <span className="rpt-recent-name">Team Performance Report</span>
                  <span className="rpt-recent-date">Generated on May 20, 2024</span>
                </div>
                <button className="rpt-download-btn"><Download size={16} /></button>
              </div>
              <div className="rpt-recent-item">
                <div className="rpt-recent-icon-box rpt-bg-light-orange">
                  <FileText size={18} className="rpt-text-orange" />
                </div>
                <div className="rpt-recent-details">
                  <span className="rpt-recent-name">Task Status Report</span>
                  <span className="rpt-recent-date">Generated on May 19, 2024</span>
                </div>
                <button className="rpt-download-btn"><Download size={16} /></button>
              </div>
            </div>
            <div className="rpt-card-footer">
              <a href="#" className="rpt-footer-link">View all reports <ArrowRight size={14} /></a>
            </div>
          </div>
        </div>
      </div>
  );
};
