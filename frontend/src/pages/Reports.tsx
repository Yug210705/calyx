import React, { useState } from 'react';
import './Reports.css';
import { ReportsOverview } from './reports/ReportsOverview';
import { ReportsProjects } from './reports/ReportsProjects';
import { ReportsTasks } from './reports/ReportsTasks';
import { ReportsTeams } from './reports/ReportsTeams';
import { ReportsTime } from './reports/ReportsTime';
import { ReportsWorkload } from './reports/ReportsWorkload';
import { ReportsCustom } from './reports/ReportsCustom';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Projects', 'Tasks', 'Teams', 'Time', 'Workload', 'Custom Reports'];

  return (
    <div className="rpt-container">
      {/* TOP SECTION */}
      <header className="global-page-header">
        <div className="global-page-header-left">
          <h1 className="rpt-title">Reports</h1>
          <p className="rpt-subtitle">Analyze productivity, progress and performance across your workspace.</p>
        </div>
      </header>

      {/* TABS BAR */}
      <div className="rpt-tabs">
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`rpt-tab ${activeTab === tab ? 'rpt-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      {activeTab === 'Overview' && <ReportsOverview />}
      {activeTab === 'Projects' && <ReportsProjects />}
      {activeTab === 'Tasks' && <ReportsTasks />}
      {activeTab === 'Teams' && <ReportsTeams />}
      {activeTab === 'Time' && <ReportsTime />}
      {activeTab === 'Workload' && <ReportsWorkload />}
      {activeTab === 'Custom Reports' && <ReportsCustom />}
    </div>
  );
};
