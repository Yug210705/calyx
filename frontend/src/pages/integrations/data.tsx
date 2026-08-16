import React from 'react';

const SimpleIcon = ({ name, color, size, overrideUrl }: { name: string, color?: string, size?: number, overrideUrl?: string }) => (
  <img 
    src={overrideUrl || `https://cdn.simpleicons.org/${name}/${color ? color.replace('#', '') : 'default'}`} 
    style={{ width: size || 24, height: size || 24, objectFit: 'contain' }} 
    alt={name} 
  />
);

export const ALL_INTEGRATIONS = [
  { 
    id: 'slack', 
    name: 'Slack', 
    desc: 'Send notifications and updates to Slack channels', 
    icon: (props: any) => <SimpleIcon name="slack" color="#E01E5A" overrideUrl="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" {...props} />, 
    iconColor: '#E01E5A', 
    category: 'Communication', 
    catColor: 'purple',
    status: 'Connected', 
    statusText: 'Connected',
    lastSynced: '2 min ago', 
    calls: '12,450',
    details: {
      connectedOn: 'Apr 15, 2024 10:30 AM',
      connectedBy: 'Arjun Mehta',
      workspace: 'acme-corp.slack.com',
      channel: '#atlas-notifications',
      stats: { s1: '12,450', l1: 'Messages Sent', s2: '3,210', l2: 'Interactions', s3: '98%', l3: 'Success Rate' }
    }
  },
  { 
    id: 'jira', 
    name: 'Jira Cloud', 
    desc: 'Sync issues, projects and workflows', 
    icon: (props: any) => <SimpleIcon name="jira" color="#0052CC" {...props} />, 
    iconColor: '#0052CC',
    category: 'Project Management', 
    catColor: 'blue',
    status: 'Connected', 
    statusText: 'Connected',
    lastSynced: '5 min ago', 
    calls: '8,230',
    details: {
      connectedOn: 'May 01, 2024 09:15 AM',
      connectedBy: 'Sarah Chen',
      workspace: 'acme.atlassian.net',
      channel: 'ATLAS Project',
      stats: { s1: '8,230', l1: 'Issues Synced', s2: '1,420', l2: 'Comments', s3: '99%', l3: 'Success Rate' }
    }
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    desc: 'Track commits, PRs and repository events', 
    icon: (props: any) => <SimpleIcon name="github" color="#181717" {...props} />, 
    iconColor: '#181717',
    category: 'Development', 
    catColor: 'green',
    status: 'Connected', 
    statusText: 'Connected',
    lastSynced: '10 min ago', 
    calls: '15,760',
    details: {
      connectedOn: 'Mar 12, 2024 11:20 AM',
      connectedBy: 'Alex Rivera',
      workspace: 'github.com/acmecorp',
      channel: 'atlas-frontend',
      stats: { s1: '15,760', l1: 'Events Synced', s2: '450', l2: 'PRs Linked', s3: '100%', l3: 'Success Rate' }
    }
  },
  { 
    id: 'gdrive', 
    name: 'Google Drive', 
    desc: 'Attach files and store documents', 
    icon: (props: any) => <SimpleIcon name="googledrive" color="#0F9D58" {...props} />, 
    iconColor: '#0F9D58',
    category: 'Storage', 
    catColor: 'orange',
    status: 'Connected', 
    statusText: 'Connected',
    lastSynced: '1 min ago', 
    calls: '6,890',
    details: {
      connectedOn: 'Jan 05, 2024 08:00 AM',
      connectedBy: 'Admin User',
      workspace: 'drive.google.com/acme',
      channel: 'Atlas Attachments',
      stats: { s1: '6,890', l1: 'Files Linked', s2: '120GB', l2: 'Storage Used', s3: '99%', l3: 'Success Rate' }
    }
  },
  { 
    id: 'teams', 
    name: 'Microsoft Teams', 
    desc: 'Collaborate with your team in Teams', 
    icon: (props: any) => <SimpleIcon name="microsoftteams" color="#6264A7" overrideUrl="https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg" {...props} />, 
    iconColor: '#6264A7',
    category: 'Communication', 
    catColor: 'purple',
    status: 'Error', 
    statusText: 'Error\nReauthenticate',
    lastSynced: '1 day ago', 
    calls: '2,340',
    details: {
      connectedOn: 'Feb 20, 2024 02:45 PM',
      connectedBy: 'Emily Davis',
      workspace: 'acme.teams.microsoft.com',
      channel: 'General',
      stats: { s1: '2,340', l1: 'Messages Sent', s2: '15', l2: 'Errors', s3: '85%', l3: 'Success Rate' }
    }
  },
  { 
    id: 'zapier', 
    name: 'Zapier', 
    desc: 'Automate workflows between apps', 
    icon: (props: any) => <SimpleIcon name="zapier" color="#FF4A00" {...props} />, 
    iconColor: '#FF4A00',
    category: 'Automation', 
    catColor: 'orange',
    status: 'Connected', 
    statusText: 'Connected',
    lastSynced: '15 min ago', 
    calls: '3,120',
    details: {
      connectedOn: 'Nov 10, 2023 10:00 AM',
      connectedBy: 'Arjun Mehta',
      workspace: 'zapier.com/acme',
      channel: '5 Active Zaps',
      stats: { s1: '3,120', l1: 'Tasks Automated', s2: '5', l2: 'Active Zaps', s3: '95%', l3: 'Success Rate' }
    }
  },
  { 
    id: 'salesforce', 
    name: 'Salesforce', 
    desc: 'Sync CRM data and opportunities', 
    icon: (props: any) => <SimpleIcon name="salesforce" color="#00A1E0" overrideUrl="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" {...props} />, 
    iconColor: '#00A1E0',
    category: 'CRM', 
    catColor: 'blue',
    status: 'Disabled', 
    statusText: 'Disabled',
    lastSynced: '-', 
    calls: '0',
    details: {
      connectedOn: '-',
      connectedBy: '-',
      workspace: '-',
      channel: '-',
      stats: { s1: '0', l1: 'Records Synced', s2: '0', l2: 'Updates', s3: '-', l3: 'Success Rate' }
    }
  },
  { 
    id: 'mongodb', 
    name: 'MongoDB Atlas', 
    desc: 'Connect and sync database data', 
    icon: (props: any) => <SimpleIcon name="mongodb" color="#47A248" {...props} />, 
    iconColor: '#13AA52',
    category: 'Database', 
    catColor: 'blue',
    status: 'Connected', 
    statusText: 'Connected',
    lastSynced: '8 min ago', 
    calls: '1,980',
    details: {
      connectedOn: 'Jun 10, 2024 04:30 PM',
      connectedBy: 'Michael Lee',
      workspace: 'cloud.mongodb.com',
      channel: 'Cluster0',
      stats: { s1: '1,980', l1: 'Queries', s2: '45MB', l2: 'Data Synced', s3: '100%', l3: 'Success Rate' }
    }
  }
];
