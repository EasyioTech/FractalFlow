import { Node, Edge, Viewport } from 'reactflow';

export type NodeType =
    | 'service'
    | 'database'
    | 'gateway'
    | 'queue'
    | 'cache'
    | 'storage'
    | 'mobile'
    | 'browser'
    | 'code-block'
    | 'text-block'
    | 'group'
    | 'waypoint';

export interface NodeData {
    label: string;
    icon?: string;
    description?: string;
    childGraphId?: string;
    [key: string]: any;
}

export type ArchNode = Node<NodeData>;

export interface EdgeData {
    variant?: 'default' | 'dashed' | 'dotted';
    animated?: boolean;
    label?: string;
    bidirectional?: boolean;
    [key: string]: any;
}

export type ArchEdge = Edge<EdgeData>;

export interface Graph {
    id: string;
    name: string;
    nodes: ArchNode[];
    edges: ArchEdge[];
    viewport: Viewport;
}
