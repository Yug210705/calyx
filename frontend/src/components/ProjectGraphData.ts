export type NodeType = 'Project' | 'Module' | 'Component' | 'Tech' | 'Database' | 'Team';

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  val: number; // size
  color: string;
  desc?: string;
  lastUpdated?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number; // thickness/activity
  label?: string;
  date?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const COLORS = {
  Project: '#8b5cf6',   // Purple
  Module: '#3b82f6',    // Blue
  Component: '#06b6d4', // Cyan
  Tech: '#10b981',      // Green
  Database: '#f59e0b',  // Orange
  Team: '#ec4899',      // Pink
};

const getRandomDate = () => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const generateGraphData = (projectName: string): GraphData => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 1. Central Project Node
  const projId = 'proj_root';
  nodes.push({ 
    id: projId, 
    name: projectName, 
    type: 'Project', 
    val: 35, 
    color: COLORS.Project, 
    desc: 'Core Project Repository',
    lastUpdated: getRandomDate()
  });

  // 2. Main Modules
  const modules = [
    { id: 'mod_auth', name: 'Authentication System', desc: 'Handles OAuth2, JWT, and User Sessions' },
    { id: 'mod_api', name: 'API Gateway', desc: 'Main ingress, rate limiting, and routing' },
    { id: 'mod_ui', name: 'Frontend Application', desc: 'React-based client interface' },
    { id: 'mod_billing', name: 'Billing Engine', desc: 'Stripe integration and invoice generation' },
    { id: 'mod_data', name: 'Data Pipeline', desc: 'Analytics and ETL processes' }
  ];

  modules.forEach(mod => {
    nodes.push({ id: mod.id, name: mod.name, type: 'Module', val: 25, color: COLORS.Module, desc: mod.desc, lastUpdated: getRandomDate() });
    links.push({ source: projId, target: mod.id, value: 4, label: 'contains' });
  });

  // 3. Sub-components
  const components = [
    { id: 'comp_jwt', parent: 'mod_auth', name: 'JWT Validator', desc: 'Validates tokens' },
    { id: 'comp_oauth', parent: 'mod_auth', name: 'OAuth Providers', desc: 'Google/GitHub login' },
    { id: 'comp_router', parent: 'mod_api', name: 'Traefik Router', desc: 'Dynamic routing' },
    { id: 'comp_rate', parent: 'mod_api', name: 'Rate Limiter', desc: 'Redis-based sliding window' },
    { id: 'comp_dash', parent: 'mod_ui', name: 'Dashboard View', desc: 'Main user interface' },
    { id: 'comp_state', parent: 'mod_ui', name: 'Redux Store', desc: 'Global state management' },
    { id: 'comp_stripe', parent: 'mod_billing', name: 'Stripe Webhooks', desc: 'Payment events handler' },
    { id: 'comp_invoice', parent: 'mod_billing', name: 'Invoice PDF Gen', desc: 'Generates PDFs' },
    { id: 'comp_etl', parent: 'mod_data', name: 'Airflow DAGs', desc: 'Scheduled jobs' },
    { id: 'comp_warehouse', parent: 'mod_data', name: 'Data Warehouse Sync', desc: 'Syncs to BigQuery' }
  ];

  components.forEach(comp => {
    nodes.push({ id: comp.id, name: comp.name, type: 'Component', val: 15, color: COLORS.Component, desc: comp.desc, lastUpdated: getRandomDate() });
    links.push({ source: comp.parent, target: comp.id, value: 2, label: 'implements' });
  });

  // Cross-component communication (Deep interconnectivity)
  links.push({ source: 'comp_dash', target: 'mod_api', value: 3, label: 'fetches data via' });
  links.push({ source: 'mod_api', target: 'mod_auth', value: 3, label: 'authenticates via' });
  links.push({ source: 'mod_billing', target: 'mod_api', value: 1, label: 'registers webhooks via' });
  links.push({ source: 'comp_invoice', target: 'comp_etl', value: 1, label: 'triggers' });

  // 4. Tech Stack & Databases
  const techStack = [
    { id: 'tech_react', name: 'React 18', type: 'Tech' },
    { id: 'tech_node', name: 'Node.js', type: 'Tech' },
    { id: 'tech_go', name: 'Go', type: 'Tech' },
    { id: 'tech_python', name: 'Python', type: 'Tech' },
    { id: 'db_pg', name: 'PostgreSQL 15', type: 'Database' },
    { id: 'db_redis', name: 'Redis', type: 'Database' },
    { id: 'tech_docker', name: 'Docker', type: 'Tech' },
  ];

  techStack.forEach(tech => {
    nodes.push({ id: tech.id, name: tech.name, type: tech.type as NodeType, val: 18, color: COLORS[tech.type as NodeType], desc: `Core infrastructure: ${tech.name}` });
  });

  // Link Tech to Components
  links.push({ source: 'comp_dash', target: 'tech_react', value: 2, label: 'built with' });
  links.push({ source: 'comp_state', target: 'tech_react', value: 2, label: 'built with' });
  links.push({ source: 'mod_auth', target: 'tech_node', value: 2, label: 'runs on' });
  links.push({ source: 'mod_api', target: 'tech_go', value: 2, label: 'runs on' });
  links.push({ source: 'mod_billing', target: 'tech_node', value: 2, label: 'runs on' });
  links.push({ source: 'mod_data', target: 'tech_python', value: 2, label: 'runs on' });
  links.push({ source: 'comp_rate', target: 'db_redis', value: 3, label: 'stores data in' });
  links.push({ source: 'mod_auth', target: 'db_pg', value: 3, label: 'stores users in' });
  links.push({ source: 'mod_billing', target: 'db_pg', value: 3, label: 'stores transactions in' });
  links.push({ source: 'mod_data', target: 'db_pg', value: 1, label: 'reads from' });

  // 5. Team Members (Who worked on what & when)
  const team = [
    { id: 'team_yug', name: 'Yug', role: 'Fullstack Lead' },
    { id: 'team_riya', name: 'Riya', role: 'Frontend Engineer' },
    { id: 'team_arjun', name: 'Arjun', role: 'Backend Engineer' },
    { id: 'team_neha', name: 'Neha', role: 'Data Engineer' },
    { id: 'team_alex', name: 'Alex', role: 'DevOps' }
  ];

  team.forEach(member => {
    nodes.push({ id: member.id, name: member.name, type: 'Team', val: 12, color: COLORS.Team, desc: member.role });
  });

  // Link Team to Modules/Components with specific dates
  const assignWork = (memberId: string, targetId: string, frequency: number) => {
    links.push({ 
      source: memberId, 
      target: targetId, 
      value: frequency, 
      label: 'committed code to',
      date: getRandomDate()
    });
  };

  assignWork('team_yug', 'mod_api', 5);
  assignWork('team_yug', 'comp_jwt', 3);
  assignWork('team_riya', 'mod_ui', 6);
  assignWork('team_riya', 'comp_dash', 4);
  assignWork('team_arjun', 'mod_auth', 5);
  assignWork('team_arjun', 'mod_billing', 4);
  assignWork('team_neha', 'mod_data', 7);
  assignWork('team_neha', 'comp_warehouse', 5);
  assignWork('team_alex', 'tech_docker', 6);
  assignWork('team_alex', 'mod_api', 2);
  assignWork('team_yug', 'comp_stripe', 2);
  assignWork('team_riya', 'comp_state', 3);

  return { nodes, links };
};
