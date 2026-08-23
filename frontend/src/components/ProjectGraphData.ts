export type NodeType = 'Project' | 'Module' | 'Tech' | 'Database' | 'Team';

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  val: number; // size
  color: string;
  desc?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number; // thickness/activity
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const COLORS = {
  Project: '#8b5cf6',   // Purple
  Module: '#3b82f6',    // Blue
  Tech: '#10b981',      // Green
  Database: '#f59e0b',  // Orange
  Team: '#ec4899',      // Pink
};

export const generateGraphData = (projectName: string): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Central Project Node
  const projId = 'proj_root';
  nodes.push({ id: projId, name: projectName, type: 'Project', val: 30, color: COLORS.Project, desc: 'Core Project' });

  // Modules
  const modules = ['Auth Service', 'User Dashboard', 'API Gateway', 'Billing Engine', 'Analytics Pipeline'];
  modules.forEach((mod, i) => {
    const modId = `mod_${i}`;
    nodes.push({ id: modId, name: mod, type: 'Module', val: 20, color: COLORS.Module, desc: `Core module: ${mod}` });
    links.push({ source: projId, target: modId, value: Math.floor(Math.random() * 5) + 1 });
  });

  // Tech Stack & Databases
  const techStack = [
    { name: 'React', type: 'Tech' },
    { name: 'Node.js', type: 'Tech' },
    { name: 'TypeScript', type: 'Tech' },
    { name: 'PostgreSQL', type: 'Database' },
    { name: 'Redis', type: 'Database' },
    { name: 'MongoDB', type: 'Database' },
    { name: 'Docker', type: 'Tech' },
  ];

  techStack.forEach((tech, i) => {
    const techId = `tech_${i}`;
    nodes.push({ id: techId, name: tech.name, type: tech.type as NodeType, val: 15, color: COLORS[tech.type as NodeType], desc: `${tech.type} used in the project` });
    
    // Connect tech randomly to 1-3 modules
    const numLinks = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numLinks; j++) {
      const randModId = `mod_${Math.floor(Math.random() * modules.length)}`;
      links.push({ source: techId, target: randModId, value: Math.floor(Math.random() * 3) + 1, label: 'uses' });
    }
  });

  // Team Members
  const team = ['Yug', 'Riya', 'Arjun', 'Neha', 'Alex'];
  team.forEach((member, i) => {
    const memberId = `member_${i}`;
    nodes.push({ id: memberId, name: member, type: 'Team', val: 12, color: COLORS.Team, desc: `Core contributor` });
    
    // Connect team members to 1-2 modules they work on frequently
    const numLinks = Math.floor(Math.random() * 2) + 1;
    for (let j = 0; j < numLinks; j++) {
      const randModId = `mod_${Math.floor(Math.random() * modules.length)}`;
      links.push({ source: memberId, target: randModId, value: Math.floor(Math.random() * 8) + 2, label: 'works on' });
    }
  });

  return { nodes, links };
};
