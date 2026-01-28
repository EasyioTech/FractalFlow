import { create } from 'zustand';
import { ArchNode, ArchEdge, Graph, NodeType } from '../types';
import { saveArchitecture, loadArchitecture } from '../lib/db';

export interface StoreState {
    graphs: Record<string, Graph>;
    navigationStack: string[];
    currentGraphId: string;

    // History for undo/redo
    history: {
        past: Array<{ graphs: Record<string, Graph> }>;
        future: Array<{ graphs: Record<string, Graph> }>;
    };

    // Theme
    theme: 'dark' | 'light';
    toggleTheme: () => void;

    // View Lock
    viewLocked: boolean;
    toggleViewLock: () => void;

    // Actions
    initializeStore: () => void;
    addNode: (type: NodeType, position: { x: number; y: number }, label: string) => string;
    updateNode: (nodeId: string, updates: Partial<ArchNode>) => void;
    deleteNode: (nodeId: string) => void;
    addEdge: (edge: ArchEdge) => void;
    updateEdge: (edgeId: string, updates: Partial<ArchEdge>) => void;
    deleteEdge: (edgeId: string) => void;
    clearCurrentGraph: () => void;
    updateViewport: (viewport: { x: number; y: number; zoom: number }) => void;
    navigateToNode: (nodeId: string) => void;
    navigateBack: () => void;
    navigateToGraph: (graphId: string) => void;
    createChildGraph: (parentNodeId: string, name: string) => string;
    undo: () => void;
    redo: () => void;
    saveToIndexedDB: () => Promise<void>;
    loadFromIndexedDB: () => Promise<void>;
}

const createEmptyGraph = (id: string, name: string): Graph => ({
    id,
    name,
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
});

// Helper to create a deep copy of graphs for history
const cloneGraphs = (graphs: Record<string, Graph>): Record<string, Graph> => {
    return JSON.parse(JSON.stringify(graphs));
};

export const useStore = create<StoreState>((set, get) => ({
    graphs: {
        main: createEmptyGraph('main', 'System Overview'),
    },
    navigationStack: ['main'],
    currentGraphId: 'main',
    history: {
        past: [],
        future: [],
    },
    theme: 'dark',

    toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
    },

    viewLocked: false,
    toggleViewLock: () => {
        set((state) => ({ viewLocked: !state.viewLocked }));
    },

    initializeStore: () => {
        set({
            graphs: {
                main: createEmptyGraph('main', 'System Overview'),
            },
            navigationStack: ['main'],
            currentGraphId: 'main',
            history: {
                past: [],
                future: [],
            },
        });
    },

    addNode: (type: NodeType, position: { x: number; y: number }, label: string) => {
        const { currentGraphId, graphs, history } = get();
        const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newNode: ArchNode = {
            id: nodeId,
            type,
            position,
            data: {
                label,
                icon: type,
            },
        };

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...graphs[currentGraphId],
                    nodes: [...graphs[currentGraphId].nodes, newNode],
                },
            },
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: [], // Clear future when new action is performed
            },
        });

        get().saveToIndexedDB();

        return nodeId;
    },

    updateNode: (nodeId: string, updates: Partial<ArchNode>) => {
        const { currentGraphId, graphs, history } = get();
        const currentGraph = graphs[currentGraphId];

        console.log('🗄️ Store updateNode called for:', nodeId, 'in graph:', currentGraphId);
        console.log('📝 Updates:', updates);

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...currentGraph,
                    nodes: currentGraph.nodes.map(node =>
                        node.id === nodeId ? { ...node, ...updates } : node
                    ),
                },
            },
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: [],
            },
        });

        // Log the updated state
        const newState = get();
        const updatedNode = newState.graphs[currentGraphId].nodes.find(n => n.id === nodeId);
        console.log('✅ Node updated in store:', updatedNode);

        get().saveToIndexedDB();
    },

    deleteNode: (nodeId: string) => {
        const { currentGraphId, graphs, history } = get();
        const currentGraph = graphs[currentGraphId];
        const nodeToDelete = currentGraph.nodes.find(n => n.id === nodeId);

        // Smart Waypoint Deletion: Reconnect the gap
        if (nodeToDelete?.type === 'waypoint') {
            const incomingEdge = currentGraph.edges.find(e => e.target === nodeId);
            const outgoingEdge = currentGraph.edges.find(e => e.source === nodeId);

            if (incomingEdge && outgoingEdge) {
                // Connect incoming source to outgoing target
                const newEdgeId = `edge-${incomingEdge.source}-${outgoingEdge.target}-${Date.now()}`;
                const newEdge: ArchEdge = {
                    ...incomingEdge, // Inherit style from first segment
                    id: newEdgeId,
                    source: incomingEdge.source,
                    target: outgoingEdge.target,
                    targetHandle: outgoingEdge.targetHandle,
                    // Keep sourceHandle from incomingEdge
                };

                // Add new edge and delete waypoint + its connected edges
                set({
                    graphs: {
                        ...graphs,
                        [currentGraphId]: {
                            ...currentGraph,
                            edges: [
                                ...currentGraph.edges.filter(e => e.id !== incomingEdge.id && e.id !== outgoingEdge.id),
                                newEdge
                            ],
                            nodes: currentGraph.nodes.filter(n => n.id !== nodeId),
                        },
                    },
                    history: {
                        past: [...history.past, { graphs: cloneGraphs(graphs) }],
                        future: [],
                    },
                });

                get().saveToIndexedDB();
                return;
            }
        }

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...currentGraph,
                    nodes: currentGraph.nodes.filter(node => node.id !== nodeId),
                    edges: currentGraph.edges.filter(
                        edge => edge.source !== nodeId && edge.target !== nodeId
                    ),
                },
            },
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: [],
            },
        });

        get().saveToIndexedDB();
    },

    addEdge: (edge: ArchEdge) => {
        const { currentGraphId, graphs, history } = get();

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...graphs[currentGraphId],
                    edges: [...graphs[currentGraphId].edges, edge],
                },
            },
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: [],
            },
        });

        get().saveToIndexedDB();
    },

    deleteEdge: (edgeId: string) => {
        const { currentGraphId, graphs, history } = get();

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...graphs[currentGraphId],
                    edges: graphs[currentGraphId].edges.filter(edge => edge.id !== edgeId),
                },
            },
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: [],
            },
        });

        get().saveToIndexedDB();
    },

    updateEdge: (edgeId: string, updates: Partial<ArchEdge>) => {
        const { currentGraphId, graphs, history } = get();
        const currentGraph = graphs[currentGraphId];

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...currentGraph,
                    edges: currentGraph.edges.map(edge =>
                        edge.id === edgeId ? { ...edge, ...updates } : edge
                    ),
                },
            },
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: [],
            },
        });

        get().saveToIndexedDB();
    },

    clearCurrentGraph: () => {
        const { currentGraphId, graphs, history } = get();

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...graphs[currentGraphId],
                    nodes: [],
                    edges: [],
                },
            },
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: [],
            },
        });

        get().saveToIndexedDB();
    },

    updateViewport: (viewport: { x: number; y: number; zoom: number }) => {
        const { currentGraphId, graphs } = get();

        set({
            graphs: {
                ...graphs,
                [currentGraphId]: {
                    ...graphs[currentGraphId],
                    viewport,
                },
            },
        });
    },

    createChildGraph: (_parentNodeId: string, name: string): string => {
        const { graphs } = get();
        const graphId = `graph-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        set({
            graphs: {
                ...graphs,
                [graphId]: createEmptyGraph(graphId, name),
            },
        });

        return graphId;
    },

    navigateToNode: (nodeId: string) => {
        const { currentGraphId, graphs, navigationStack, createChildGraph, updateNode } = get();
        const currentGraph = graphs[currentGraphId];
        const targetNode = currentGraph.nodes.find(n => n.id === nodeId);

        if (!targetNode) return;

        // If node doesn't have a child graph, create one
        let childGraphId = targetNode.data.childGraphId;
        if (!childGraphId) {
            childGraphId = createChildGraph(nodeId, `${targetNode.data.label} (Detail)`);
            updateNode(nodeId, {
                data: {
                    ...targetNode.data,
                    childGraphId,
                },
            });
        }

        // Navigate to the child graph
        set({
            navigationStack: [...navigationStack, childGraphId],
            currentGraphId: childGraphId,
        });

        get().saveToIndexedDB();
    },

    navigateBack: () => {
        const { navigationStack } = get();

        if (navigationStack.length <= 1) return;

        const newStack = navigationStack.slice(0, -1);

        set({
            navigationStack: newStack,
            currentGraphId: newStack[newStack.length - 1],
        });

        get().saveToIndexedDB();
    },

    navigateToGraph: (graphId: string) => {
        const { navigationStack } = get();
        const index = navigationStack.indexOf(graphId);

        if (index === -1) return;

        // Slice stack up to and including the target graph
        const newStack = navigationStack.slice(0, index + 1);

        set({
            navigationStack: newStack,
            currentGraphId: graphId,
        });

        get().saveToIndexedDB();
    },


    undo: () => {
        const { history, graphs } = get();

        if (history.past.length === 0) return;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);

        set({
            graphs: previous.graphs,
            history: {
                past: newPast,
                future: [{ graphs: cloneGraphs(graphs) }, ...history.future],
            },
        });
    },

    redo: () => {
        const { history, graphs } = get();

        if (history.future.length === 0) return;

        const next = history.future[0];
        const newFuture = history.future.slice(1);

        set({
            graphs: next.graphs,
            history: {
                past: [...history.past, { graphs: cloneGraphs(graphs) }],
                future: newFuture,
            },
        });
    },

    saveToIndexedDB: async () => {
        const state = get();

        try {
            // Save only the serializable parts of the state
            await saveArchitecture({
                graphs: state.graphs,
                navigationStack: state.navigationStack,
                currentGraphId: state.currentGraphId,
                history: state.history,
                theme: state.theme,
                viewLocked: state.viewLocked,
                // Functions are not serializable, so we don't save them
            } as StoreState);
        } catch (error) {
            console.error('Failed to save to IndexedDB:', error);
        }
    },

    loadFromIndexedDB: async () => {
        try {
            const state = await loadArchitecture();

            if (state) {
                set({
                    graphs: state.graphs,
                    navigationStack: state.navigationStack,
                    currentGraphId: state.currentGraphId,
                });
            }
        } catch (error) {
            console.error('Failed to load from IndexedDB:', error);
        }
    },
}));
