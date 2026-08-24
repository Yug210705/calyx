import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Clock, 
  Users, 
  Share2, 
  Star,
  MessageSquare,
  History,
  Lock,
  Settings
} from 'lucide-react';
import './Documents.css';

// Mock Data
const DOCUMENT_TREE = [
  {
    id: '1',
    name: 'Engineering',
    type: 'folder',
    children: [
      { id: '1-1', name: 'Architecture Overview', type: 'file' },
      { id: '1-2', name: 'API Guidelines', type: 'file' },
      { 
        id: '1-3', 
        name: 'Sprint Planning', 
        type: 'folder',
        children: [
          { id: '1-3-1', name: 'Sprint 42 Goals', type: 'file' },
          { id: '1-3-2', name: 'Sprint 43 Goals', type: 'file' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Product',
    type: 'folder',
    children: [
      { id: '2-1', name: 'Q3 Roadmap', type: 'file' },
      { id: '2-2', name: 'User Research', type: 'file' }
    ]
  },
  {
    id: '3',
    name: 'Company Handbook',
    type: 'file'
  }
];

const TreeNode = ({ node, level = 0 }: { node: any, level?: number }) => {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isFolder = node.type === 'folder';

  return (
    <div className="tree-node-wrapper">
      <div 
        className={`tree-node ${!isFolder ? 'is-file' : ''}`}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        <div className="tree-node-left">
          {isFolder ? (
            <span className="tree-node-toggle">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          ) : (
            <span className="tree-node-indent"></span>
          )}
          {isFolder ? <Folder size={16} className="tree-node-icon folder-icon" /> : <FileText size={16} className="tree-node-icon file-icon" />}
          <span className="tree-node-name">{node.name}</span>
        </div>
        {isFolder && (
          <div className="tree-node-actions">
            <Plus size={14} />
            <MoreHorizontal size={14} />
          </div>
        )}
      </div>
      {isFolder && isOpen && node.children && (
        <div className="tree-node-children">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Documents = () => {
  return (
    <div className="documents-container">
      {/* Sidebar Navigation */}
      <aside className="doc-sidebar">
        <div className="doc-sidebar-header">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search spaces..." />
          </div>
        </div>

        <div className="doc-sidebar-section">
          <div className="section-title">FAVORITES</div>
          <div className="tree-node is-file" style={{ paddingLeft: '12px' }}>
            <FileText size={16} className="tree-node-icon file-icon" />
            <span className="tree-node-name">Q3 Roadmap</span>
          </div>
        </div>

        <div className="doc-sidebar-section">
          <div className="section-title">
            WORKSPACE
            <Plus size={14} className="add-icon" />
          </div>
          <div className="tree-container">
            {DOCUMENT_TREE.map(node => (
              <TreeNode key={node.id} node={node} />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="doc-main">
        {/* Top Navbar */}
        <header className="doc-header">
          <div className="breadcrumb">
            <span className="crumb">Engineering</span>
            <ChevronRight size={16} className="crumb-separator" />
            <span className="crumb">Sprint Planning</span>
            <ChevronRight size={16} className="crumb-separator" />
            <span className="crumb active">Sprint 42 Goals</span>
          </div>
          
          <div className="doc-actions">
            <div className="collaborators">
              <img src="https://i.pravatar.cc/150?u=a" alt="User" className="avatar" />
              <img src="https://i.pravatar.cc/150?u=b" alt="User" className="avatar" />
              <div className="avatar-more">+3</div>
            </div>
            <button className="action-btn icon-btn"><MessageSquare size={16} /></button>
            <button className="action-btn icon-btn"><Clock size={16} /></button>
            <button className="action-btn icon-btn"><Star size={16} /></button>
            <button className="action-btn primary-btn"><Share2 size={16} /> Share</button>
            <button className="action-btn icon-btn"><MoreHorizontal size={16} /></button>
          </div>
        </header>

        {/* Document Editor / View */}
        <div className="doc-content-wrapper">
          <div className="doc-cover-image">
            <img src="https://images.unsplash.com/photo-1506744626753-1fa28f6f53cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Cover" />
          </div>
          
          <div className="doc-content">
            <div className="doc-icon-huge">🎯</div>
            <h1 className="doc-title">Sprint 42 Goals</h1>
            
            <div className="doc-meta">
              <div className="meta-item">
                <img src="https://i.pravatar.cc/150?u=c" alt="Author" className="meta-avatar" />
                <span>Last edited by <strong>Sarah Connor</strong> yesterday at 4:30 PM</span>
              </div>
              <div className="meta-divider"></div>
              <div className="meta-item">
                <Lock size={14} className="meta-icon" />
                <span>Engineering Team</span>
              </div>
            </div>

            <div className="rich-text-body">
              <p className="lead">This sprint focuses on solidifying our core architecture and reducing technical debt ahead of the Q3 enterprise launch.</p>
              
              <h2>Key Objectives</h2>
              <ul>
                <li><strong>Migrate legacy auth:</strong> Transition all remaining v1 endpoints to the new OAuth2.0 standard.</li>
                <li><strong>Performance tuning:</strong> Reduce p95 latency on the main dashboard to &lt; 200ms.</li>
                <li><strong>Design system:</strong> Implement the new table components across the platform.</li>
              </ul>

              <h2>Metrics for Success</h2>
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Current</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>API Latency (p95)</td>
                    <td>450ms</td>
                    <td>200ms</td>
                  </tr>
                  <tr>
                    <td>Test Coverage</td>
                    <td>78%</td>
                    <td>85%</td>
                  </tr>
                  <tr>
                    <td>Open Sev-1 Bugs</td>
                    <td>3</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>

              <h2>Action Items</h2>
              <div className="task-list">
                <div className="task-item checked">
                  <input type="checkbox" checked readOnly />
                  <span>Finalize architecture review for new auth module</span>
                </div>
                <div className="task-item">
                  <input type="checkbox" readOnly />
                  <span>Deploy database indexes to staging</span>
                </div>
                <div className="task-item">
                  <input type="checkbox" readOnly />
                  <span>Update internal documentation for component library</span>
                </div>
              </div>
              
              <div className="callout-block warning">
                <strong>Important:</strong> Deployment freeze goes into effect on Thursday at 2:00 PM EST. All critical PRs must be merged before then.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Info/Details (Optional/Hidden on small screens) */}
      <aside className="doc-details-sidebar">
        <div className="details-header">
          <h3>Page Details</h3>
        </div>
        
        <div className="details-section">
          <h4>PROPERTIES</h4>
          <div className="property-item">
            <span className="prop-label">Status</span>
            <span className="prop-value status-active">In Progress</span>
          </div>
          <div className="property-item">
            <span className="prop-label">Owner</span>
            <div className="prop-value owner">
              <img src="https://i.pravatar.cc/150?u=c" alt="Owner" />
              Sarah Connor
            </div>
          </div>
          <div className="property-item">
            <span className="prop-label">Tags</span>
            <div className="prop-value tags">
              <span className="tag">sprint-planning</span>
              <span className="tag">engineering</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h4>VERSION HISTORY</h4>
          <div className="history-item">
            <div className="history-dot"></div>
            <div className="history-info">
              <div className="history-title">Current Version</div>
              <div className="history-meta">Sarah Connor • Yesterday 4:30 PM</div>
            </div>
          </div>
          <div className="history-item">
            <div className="history-dot"></div>
            <div className="history-info">
              <div className="history-title">Added Metrics Table</div>
              <div className="history-meta">John Smith • Yesterday 2:15 PM</div>
            </div>
          </div>
          <div className="history-item">
            <div className="history-dot"></div>
            <div className="history-info">
              <div className="history-title">Initial Draft</div>
              <div className="history-meta">Sarah Connor • Aug 22 10:00 AM</div>
            </div>
          </div>
          <button className="view-all-btn">View full history</button>
        </div>
      </aside>
    </div>
  );
};
