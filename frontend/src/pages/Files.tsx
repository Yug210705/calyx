import React, { useState } from 'react';
import { 
  Upload, Search, Filter, ArrowUpDown, Grid as GridIcon, List as ListIcon, 
  FileText, PenTool as Figma, FileCode, Image as ImageIcon, File as FileIcon, Folder, 
  MoreVertical, Star, HardDrive, Clock, Users, Trash, ChevronRight, Video,
  Plus
} from 'lucide-react';
import './Files.css';

type FileType = 'folder' | 'pdf' | 'figma' | 'code' | 'image' | 'video' | 'document';

interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  updatedAt: string;
  sharedWith: string[];
  isStarred: boolean;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'Q3 Marketing Assets', type: 'folder', size: '--', updatedAt: 'Oct 24, 2023', sharedWith: ['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2'], isStarred: true },
  { id: '2', name: 'Engineering Specs', type: 'folder', size: '--', updatedAt: 'Oct 22, 2023', sharedWith: ['https://i.pravatar.cc/150?u=3'], isStarred: false },
  { id: '3', name: 'Atlas_Architecture_v2.pdf', type: 'pdf', size: '4.2 MB', updatedAt: 'Oct 21, 2023', sharedWith: ['https://i.pravatar.cc/150?u=4', 'https://i.pravatar.cc/150?u=5'], isStarred: true },
  { id: '4', name: 'Dashboard_UI_Components.fig', type: 'figma', size: '15.8 MB', updatedAt: 'Oct 20, 2023', sharedWith: ['https://i.pravatar.cc/150?u=6'], isStarred: false },
  { id: '5', name: 'auth_middleware.ts', type: 'code', size: '12 KB', updatedAt: 'Oct 19, 2023', sharedWith: ['https://i.pravatar.cc/150?u=7'], isStarred: false },
  { id: '6', name: 'Hero_Background_Dark.png', type: 'image', size: '2.1 MB', updatedAt: 'Oct 18, 2023', sharedWith: [], isStarred: false },
  { id: '7', name: 'Product_Demo_Final.mp4', type: 'video', size: '245 MB', updatedAt: 'Oct 15, 2023', sharedWith: ['https://i.pravatar.cc/150?u=8', 'https://i.pravatar.cc/150?u=9', 'https://i.pravatar.cc/150?u=10'], isStarred: true },
  { id: '8', name: 'Q4_OKRs_Draft.docx', type: 'document', size: '1.1 MB', updatedAt: 'Oct 14, 2023', sharedWith: ['https://i.pravatar.cc/150?u=11'], isStarred: false },
  { id: '9', name: 'Onboarding_Flow', type: 'folder', size: '--', updatedAt: 'Oct 10, 2023', sharedWith: ['https://i.pravatar.cc/150?u=12'], isStarred: false },
  { id: '10', name: 'API_Documentation.pdf', type: 'pdf', size: '3.4 MB', updatedAt: 'Oct 08, 2023', sharedWith: ['https://i.pravatar.cc/150?u=13', 'https://i.pravatar.cc/150?u=14'], isStarred: false },
];

const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'folder': return <Folder className="file-icon folder-icon" />;
    case 'pdf': return <FileText className="file-icon pdf-icon" />;
    case 'figma': return <Figma className="file-icon figma-icon" />;
    case 'code': return <FileCode className="file-icon code-icon" />;
    case 'image': return <ImageIcon className="file-icon image-icon" />;
    case 'video': return <Video className="file-icon video-icon" />;
    case 'document': return <FileIcon className="file-icon doc-icon" />;
    default: return <FileIcon className="file-icon default-icon" />;
  }
};

export const Files = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredFiles = mockFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="files-container">
      {/* Header Section */}
      <header className="files-header">
        <div className="header-title-group">
          <h1>Files</h1>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <span className="current">All Files</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="btn-primary">
            <Upload size={16} />
            <span>Upload File</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="files-content-wrapper">
        {/* Sidebar */}
        <aside className="files-sidebar">
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              <HardDrive size={18} />
              <span>All Files</span>
            </button>
            <button className={`nav-item ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setActiveTab('recent')}>
              <Clock size={18} />
              <span>Recent</span>
            </button>
            <button className={`nav-item ${activeTab === 'shared' ? 'active' : ''}`} onClick={() => setActiveTab('shared')}>
              <Users size={18} />
              <span>Shared with me</span>
            </button>
            <button className={`nav-item ${activeTab === 'starred' ? 'active' : ''}`} onClick={() => setActiveTab('starred')}>
              <Star size={18} />
              <span>Starred</span>
            </button>
            <button className={`nav-item ${activeTab === 'trash' ? 'active' : ''}`} onClick={() => setActiveTab('trash')}>
              <Trash size={18} />
              <span>Trash</span>
            </button>
          </nav>

          {/* Storage Capacity Widget */}
          <div className="storage-widget">
            <div className="storage-header">
              <HardDrive size={16} />
              <span>Storage</span>
            </div>
            <div className="storage-progress-bar">
              <div className="storage-progress-fill" style={{ width: '45%' }}></div>
            </div>
            <div className="storage-stats">
              <span>45 GB used</span>
              <span>100 GB total</span>
            </div>
            <button className="btn-upgrade">Upgrade Plan</button>
          </div>
        </aside>

        {/* Main Files Area */}
        <main className="files-main">
          {/* Toolbar */}
          <div className="files-toolbar">
            <div className="search-bar">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search files, folders, and documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="toolbar-controls">
              <button className="btn-icon">
                <ArrowUpDown size={16} />
                <span>Sort</span>
              </button>
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <GridIcon size={16} />
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* File Grid/List */}
          <div className={`files-view ${viewMode}-view`}>
            {viewMode === 'list' && (
              <div className="list-header">
                <div className="col-name">Name</div>
                <div className="col-date">Last Modified</div>
                <div className="col-size">Size</div>
                <div className="col-shared">Shared With</div>
                <div className="col-actions"></div>
              </div>
            )}

            {filteredFiles.map(file => (
              <div key={file.id} className={`file-card ${file.type === 'folder' ? 'is-folder' : ''}`}>
                <div className="file-info-primary">
                  <div className="icon-wrapper">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="file-name-group">
                    <span className="file-name" title={file.name}>{file.name}</span>
                    {viewMode === 'grid' && <span className="file-size-grid">{file.type === 'folder' ? 'Folder' : file.size}</span>}
                  </div>
                </div>

                {viewMode === 'list' && (
                  <>
                    <div className="col-date">{file.updatedAt}</div>
                    <div className="col-size">{file.size}</div>
                  </>
                )}

                <div className={`file-shared ${viewMode === 'list' ? 'col-shared' : ''}`}>
                  {file.sharedWith.length > 0 ? (
                    <div className="avatar-group">
                      {file.sharedWith.slice(0, 3).map((avatar, idx) => (
                        <img key={idx} src={avatar} alt="User avatar" className="shared-avatar" />
                      ))}
                      {file.sharedWith.length > 3 && (
                        <div className="shared-avatar more-avatar">+{file.sharedWith.length - 3}</div>
                      )}
                    </div>
                  ) : (
                    <span className="no-shared">Only you</span>
                  )}
                </div>

                <div className={`file-actions ${viewMode === 'list' ? 'col-actions' : ''}`}>
                  <button className="action-btn star-btn">
                    <Star size={16} className={file.isStarred ? 'starred' : ''} fill={file.isStarred ? 'currentColor' : 'none'} />
                  </button>
                  <button className="action-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
