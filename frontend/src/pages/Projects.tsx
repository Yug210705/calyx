import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Plus, 
  Folder, 
  List, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { projectService } from '../services/api';
import { ProjectGraphModal } from '../components/ProjectGraphModal';
import './Projects.css';

export const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectForGraph, setSelectedProjectForGraph] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const overviewStats = [
    {
      title: 'Total Projects',
      value: projects.length.toString(),
      trend: 'this month',
      trendUp: true,
      icon: Folder,
      colorClass: 'purple'
    },
    {
      title: 'In Progress',
      value: projects.filter(p => p.status === 'In Progress').length.toString(),
      trend: 'this month',
      trendUp: true,
      icon: List,
      colorClass: 'blue'
    },
    {
      title: 'Completed',
      value: projects.filter(p => p.status === 'Completed' || p.status === 'Done').length.toString(),
      trend: 'this month',
      trendUp: true,
      icon: CheckCircle2,
      colorClass: 'green'
    },
    {
      title: 'Planning',
      value: projects.filter(p => p.status === 'Planning' || p.status === 'Todo').length.toString(),
      trend: 'this month',
      trendUp: false,
      icon: Clock,
      colorClass: 'orange'
    }
  ];

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="projects-page-wrapper">
      <div className="projects-container">
        <div className="projects-welcome-section">
          <div className="global-page-header">
            <div className="global-page-header-left">
              <h1 className="projects-title">Project Overview</h1>
              <p className="projects-subtitle">Manage and track all projects across your organization.</p>
            </div>
            <div className="global-page-header-right">
              <button className="filter-btn">
                <Filter size={16} />
                <span>Filter</span>
                <ChevronDown size={14} />
              </button>
              <button className="btn btn-primary top-bar-new-btn">
                <Plus size={16} /> New Project
              </button>
            </div>
          </div>

        <div className="overview-cards">
          {overviewStats.map((stat, idx) => (
          <div key={idx} className="overview-card">
            <div className={`icon-box ${stat.colorClass}`}>
              <stat.icon size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-trend ${stat.trendUp ? 'trend-up' : 'trend-down'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
                <span>{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      <div className="projects-list-container">
        <div className="projects-table-header">
          <div className="col-project">Project</div>
          <div className="col-status">Status</div>
          <div className="col-progress">Progress</div>
          <div className="col-team">Team</div>
          <div className="col-date">Due Date</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="projects-table-body">
            {isLoading ? (
              <div className="loading-state">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="empty-state">No projects found.</div>
            ) : (
              projects.map(project => (
              <div key={project.id} className="project-row" onClick={() => setSelectedProjectForGraph(project.title)} style={{ cursor: 'pointer' }}>
                <div className="col-project cell-project">
                  <div 
                    className="project-initial"
                    style={{ backgroundColor: project.status === 'Completed' ? '#10B981' : (project.status === 'Planning' ? '#F43F5E' : (project.status === 'On Hold' ? '#06B6D4' : '#7C3AED')) }}
                  >
                    {project.title.charAt(0)}
                  </div>
                  <div className="project-info">
                    <div className="project-name">{project.title}</div>
                    <div className="project-sub">{project.description || 'No description'}</div>
                  </div>
                </div>
                <div className="col-status cell-status">
                  <span className={`status-badge status-${project.status === 'In Progress' ? 'progress' : project.status === 'On Hold' ? 'hold' : project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
                <div className="col-progress cell-progress">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${project.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{project.progress || 0}%</span>
                </div>
                <div className="col-team cell-team">
                  <div className="team-avatars">
                    {project.team && project.team.length > 0 ? (
                      project.team.slice(0, 3).map((member: any, i: number) => (
                        <img key={i} src={member.avatar || 'https://i.pravatar.cc/150?u=' + member.id} alt="team" className="team-avatar" />
                      ))
                    ) : (
                      <span className="no-team-text">Unassigned</span>
                    )}
                    {project.team && project.team.length > 3 && (
                      <div className="team-avatar-extra">+{project.team.length - 3}</div>
                    )}
                  </div>
                </div>
                <div className="col-date cell-date">
                  {project.due_date ? new Date(project.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date'}
                </div>
                <div className="col-actions cell-actions">
                  <button className="action-btn">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))
            )}
        </div>
      </div>

      <div className="projects-footer">
        <div className="footer-text">Showing {projects.length} projects</div>
        <div className="pagination">
          <button className="page-btn"><ChevronLeft size={16} /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn"><ChevronRight size={16} /></button>
        </div>
      </div>
      </div>
      
      {selectedProjectForGraph && (
        <ProjectGraphModal 
          projectName={selectedProjectForGraph} 
          onClose={() => setSelectedProjectForGraph(null)} 
        />
      )}
    </div>
  );
};
