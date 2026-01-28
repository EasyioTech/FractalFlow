import {
    Cpu, Box, Zap, Scroll,
    Database, FileJson, Layers, ListMinus, HardDrive,
    Share2, Globe, Shield, Route,
    CreditCard, Mail, BarChart, Users,
    Layout, MousePointerClick, GitBranch, Type,
    Cloud, Server, Smartphone,
    Terminal, Code, BoxSelect, Maximize, Circle, Square, Diamond,
    CloudLightning, Monitor, Infinity, Github, Container,
} from 'lucide-react';

export type ComponentCategory = 'compute' | 'storage' | 'networking' | 'external' | 'user-flow' | 'grouping' | 'cloud-aws' | 'cloud-azure' | 'devops' | 'flowchart';

export interface ComponentConfig {
    type: string;
    label: string;
    iconName: string;
    category: ComponentCategory;
    description?: string;
}

export const COMPONENT_CATEGORIES: { id: ComponentCategory; label: string; color: string }[] = [
    { id: 'compute', label: 'Compute', color: '#3B82F6' }, // Blue
    { id: 'storage', label: 'Data & Storage', color: '#10B981' }, // Green
    { id: 'networking', label: 'Networking', color: '#8B5CF6' }, // Purple
    { id: 'external', label: 'External', color: '#F59E0B' }, // Orange
    { id: 'user-flow', label: 'User Flow', color: '#EC4899' }, // Pink
    { id: 'grouping', label: 'Grouping', color: '#6B7280' }, // Gray
    { id: 'cloud-aws', label: 'AWS', color: '#FF9900' }, // AWS Orange
    { id: 'cloud-azure', label: 'Azure', color: '#007FFF' }, // Azure Blue
    { id: 'devops', label: 'DevOps', color: '#00C7B7' }, // Teal
    { id: 'flowchart', label: 'Flowchart', color: '#64748B' }, // Slate
];

export const COMPONENT_LIBRARY: ComponentConfig[] = [
    // Compute
    { type: 'microservice', label: 'Microservice', iconName: 'Cpu', category: 'compute' },
    { type: 'serverless', label: 'Serverless', iconName: 'Zap', category: 'compute' },
    { type: 'container', label: 'Container', iconName: 'Box', category: 'compute' },
    { type: 'batch-job', label: 'Batch Job', iconName: 'Scroll', category: 'compute' },
    { type: 'server', label: 'Server', iconName: 'Server', category: 'compute' },

    // Storage
    { type: 'database', label: 'Relational DB', iconName: 'Database', category: 'storage' },
    { type: 'nosql', label: 'NoSQL DB', iconName: 'FileJson', category: 'storage' },
    { type: 'cache', label: 'Cache (Redis)', iconName: 'Layers', category: 'storage' },
    { type: 'queue', label: 'Queue (Kafka)', iconName: 'ListMinus', category: 'storage' },
    { type: 'storage', label: 'Object Storage', iconName: 'HardDrive', category: 'storage' },

    // Networking
    { type: 'load-balancer', label: 'Load Balancer', iconName: 'Share2', category: 'networking' },
    { type: 'cdn', label: 'CDN', iconName: 'Globe', category: 'networking' },
    { type: 'firewall', label: 'Firewall', iconName: 'Shield', category: 'networking' },
    { type: 'dns', label: 'DNS', iconName: 'Route', category: 'networking' },
    { type: 'api-gateway', label: 'API Gateway', iconName: 'Zap', category: 'networking' },

    // External
    { type: 'payment', label: 'Payment', iconName: 'CreditCard', category: 'external' },
    { type: 'email', label: 'Email', iconName: 'Mail', category: 'external' },
    { type: 'analytics', label: 'Analytics', iconName: 'BarChart', category: 'external' },
    { type: 'social', label: 'Social Auth', iconName: 'Users', category: 'external' },
    { type: 'edge-device', label: 'Edge Device', iconName: 'Smartphone', category: 'external' },

    // User Flow
    { type: 'screen', label: 'Screen/Page', iconName: 'Layout', category: 'user-flow' },
    { type: 'action', label: 'User Action', iconName: 'MousePointerClick', category: 'user-flow' },
    { type: 'decision', label: 'Decision', iconName: 'GitBranch', category: 'user-flow' },
    { type: 'input', label: 'Form Input', iconName: 'Type', category: 'user-flow' },

    // AWS
    { type: 'aws-lambda', label: 'AWS Lambda', iconName: 'Zap', category: 'cloud-aws' },
    { type: 'aws-ec2', label: 'AWS EC2', iconName: 'Server', category: 'cloud-aws' },
    { type: 'aws-s3', label: 'AWS S3', iconName: 'HardDrive', category: 'cloud-aws' },
    { type: 'aws-rds', label: 'AWS RDS', iconName: 'Database', category: 'cloud-aws' },
    { type: 'aws-dynamodb', label: 'DynamoDB', iconName: 'FileJson', category: 'cloud-aws' },
    { type: 'aws-api-gateway', label: 'API Gateway', iconName: 'Zap', category: 'cloud-aws' },

    // Azure
    { type: 'azure-func', label: 'Azure Functions', iconName: 'CloudLightning', category: 'cloud-azure' },
    { type: 'azure-vm', label: 'Azure VM', iconName: 'Monitor', category: 'cloud-azure' },
    { type: 'azure-blob', label: 'Azure Blob', iconName: 'HardDrive', category: 'cloud-azure' },
    { type: 'azure-cosmos', label: 'CosmosDB', iconName: 'Database', category: 'cloud-azure' },

    // DevOps
    { type: 'docker', label: 'Docker Container', iconName: 'Box', category: 'devops' },
    { type: 'kubernetes', label: 'Kubernetes Pod', iconName: 'Cloud', category: 'devops' },
    { type: 'pipeline', label: 'CI/CD Pipeline', iconName: 'Infinity', category: 'devops' },
    { type: 'vps', label: 'VPS (Linux)', iconName: 'Terminal', category: 'devops' },
    { type: 'github', label: 'GitHub Repos', iconName: 'Github', category: 'devops' },
    { type: 'jenkins', label: 'Jenkins/CI', iconName: 'Zap', category: 'devops' },

    // Flowchart (Special Types)
    { type: 'start-end', label: 'Start/End', iconName: 'Circle', category: 'flowchart' },
    { type: 'process', label: 'Process', iconName: 'Square', category: 'flowchart' },
    { type: 'condition', label: 'Condition', iconName: 'Diamond', category: 'flowchart' },
    { type: 'text-block', label: 'Text Block', iconName: 'Type', category: 'flowchart', description: 'Label or annotation' },
    { type: 'code-block', label: 'Code Snippet', iconName: 'Code', category: 'flowchart' },
    { type: 'group', label: 'Group', iconName: 'BoxSelect', category: 'flowchart', description: 'Visual container' },

    // Grouping
    { type: 'vpc', label: 'VPC / Network', iconName: 'Cloud', category: 'grouping', description: 'Container for other components' },
];

export const ICON_MAP: Record<string, any> = {
    Cpu, Box, Zap, Scroll, Server,
    Database, FileJson, Layers, ListMinus, HardDrive,
    Share2, Globe, Shield, Route,
    CreditCard, Mail, BarChart, Users,
    Layout, MousePointerClick, GitBranch, Type,
    Cloud, Smartphone,
    Terminal, Code, BoxSelect, Maximize, Circle, Square, Diamond,
    CloudLightning, Monitor, Infinity, Github, Container,
};
