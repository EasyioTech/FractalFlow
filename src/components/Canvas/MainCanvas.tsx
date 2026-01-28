import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
    Background,
    MiniMap,
    Node,
    Edge,
    Connection,
    useNodesState,
    useEdgesState,
    useReactFlow,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    BackgroundVariant,
    Panel,
    ReactFlowProvider,
    NodeMouseHandler,
    MarkerType,
    ConnectionLineType,
    ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../../store/useStore';
import { ArchNode } from '../Nodes/ArchNode';
import { GroupNode } from '../Nodes/GroupNode';
import { TextNode } from '../Nodes/TextNode';
import { CodeNode } from '../Nodes/CodeNode';
import { WaypointNode } from '../Nodes/WaypointNode';
import { CustomEdge } from '../Edges/CustomEdge';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import { TopNavigationDock } from '../Navigation/TopNavigationDock';
import { KeymapGuide } from '../Panels/KeymapGuide';
import { CommandPalette } from '../CommandPalette';

import { COMPONENT_LIBRARY } from '../../config/componentLibrary';

// Dynamically create nodeTypes object from our library
const nodeTypes = COMPONENT_LIBRARY.reduce((acc, component) => {
    if (component.type === 'group') {
        acc[component.type] = GroupNode;
    } else if (component.type === 'text-block') {
        acc[component.type] = TextNode;
    } else if (component.type === 'code-block') {
        acc[component.type] = CodeNode;
    } else {
        acc[component.type] = ArchNode;
    }
    // Add internal waypoint type
    acc['waypoint'] = WaypointNode;
    return acc;
}, {} as Record<string, any>);

// Edge types configuration
const edgeTypes = {
    smoothstep: CustomEdge,
    default: CustomEdge,
    straight: CustomEdge,
    step: CustomEdge,
    simple_bezier: CustomEdge,
};

const CanvasInner: React.FC<{ activeTool: string }> = ({ activeTool }) => {
    const {
        graphs,
        currentGraphId,
        navigateToNode,
        updateNode,
        deleteNode,
        addNode,
        addEdge: addEdgeToStore,
        updateEdge,
        deleteEdge: deleteEdgeFromStore,
        updateViewport,
        undo,
        redo,
        viewLocked,
        toggleViewLock,
        navigateBack,
        theme,
        toggleTheme,
        clearCurrentGraph,
        saveToIndexedDB
    } = useStore();

    const currentGraph = graphs[currentGraphId];
    const { fitView, zoomIn, zoomOut, screenToFlowPosition, getIntersectingNodes } = useReactFlow();
    const previousGraphIdRef = useRef<string>(currentGraphId);

    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        type: 'node' | 'edge';
        id: string;
    } | null>(null);

    const onPaneClick = useCallback((event: React.MouseEvent) => {
        setContextMenu(null);

        if (activeTool === 'text') {
            const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
            addNode('text-block', position, 'Text');
        }
    }, [activeTool, screenToFlowPosition, addNode]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        try {
            const data = event.dataTransfer.getData('application/reactflow');
            if (!data) return;

            const { type, label } = JSON.parse(data);
            const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

            addNode(type, position, label);
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }, [screenToFlowPosition, addNode]);

    // Convert our nodes to ReactFlow format
    const reactFlowNodes: Node[] = useMemo(() =>
        currentGraph?.nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data,
        })) || [],
        [currentGraph?.nodes]
    );

    const reactFlowEdges: Edge[] = useMemo(() => {
        // console.log('Recalculating edges:', currentGraph?.edges.map(e => e.data));
        return currentGraph?.edges.map(edge => {
            const style = { stroke: '#3B82F6', strokeWidth: 2, ...edge.style };

            if (edge.data?.variant === 'dashed') {
                style.strokeDasharray = '5,5';
            } else if (edge.data?.variant === 'dotted') {
                style.strokeDasharray = '2,2';
            }

            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
                type: edge.type || 'smoothstep',
                style,
                data: {
                    ...edge.data,
                    pathType: edge.type || 'smoothstep', // Pass type to the component
                    variant: edge.data?.variant, // Ensure variant is explicitly passed if not in ...edge.data
                },
                markerStart: edge.data?.bidirectional ? { type: MarkerType.ArrowClosed, color: '#3B82F6' } : undefined,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
            };
        }) || [];
    }, [currentGraph?.edges]);

    const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);
    const isDraggingRef = useRef(false);

    // Sync when navigating to a different graph
    React.useEffect(() => {
        if (previousGraphIdRef.current !== currentGraphId) {
            console.log('🔄 Navigation sync:', previousGraphIdRef.current, '→', currentGraphId);

            setNodes(reactFlowNodes);
            setEdges(reactFlowEdges);
            previousGraphIdRef.current = currentGraphId;

            if (reactFlowNodes.length === 0) {
                setTimeout(() => {
                    fitView({ padding: 0.2, duration: 200 });
                }, 50);
            }
        }
    }, [currentGraphId, setNodes, setEdges, fitView]);

    // Sync nodes when data changes
    React.useEffect(() => {
        if (!isDraggingRef.current && previousGraphIdRef.current === currentGraphId) {
            setNodes(reactFlowNodes);
        }
    }, [reactFlowNodes, currentGraphId, setNodes]);

    // Sync edges when store data changes (style, type, etc.)
    React.useEffect(() => {
        if (!isDraggingRef.current && previousGraphIdRef.current === currentGraphId) {
            setEdges(reactFlowEdges);
        }
    }, [reactFlowEdges, currentGraphId, setEdges]);

    const onConnect: OnConnect = useCallback((connection: Connection) => {
        if (!connection.source || !connection.target) return;

        // Check if source is a Diamond/Condition node
        const sourceNode = currentGraph.nodes.find(n => n.id === connection.source);
        const isConditionNode = sourceNode?.type === 'condition';

        // Auto-label based on handle for condition nodes
        let edgeLabel = '';
        if (isConditionNode && connection.sourceHandle) {
            if (connection.sourceHandle === 'yes') {
                edgeLabel = 'Yes';
            } else if (connection.sourceHandle === 'no') {
                edgeLabel = 'No';
            }
        }

        const edgeId = `edge-${connection.source}-${connection.target}-${Date.now()}`;
        addEdgeToStore({
            id: edgeId,
            source: connection.source,
            target: connection.target,
            sourceHandle: connection.sourceHandle,
            targetHandle: connection.targetHandle,
            type: 'smoothstep',
            data: {
                variant: 'default',
                animated: true,
                label: edgeLabel
            }
        });
    }, [addEdgeToStore, currentGraph]);

    const onEdgeUpdate = useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            updateEdge(oldEdge.id, {
                source: newConnection.source || oldEdge.source,
                target: newConnection.target || oldEdge.target,
                sourceHandle: newConnection.sourceHandle,
                targetHandle: newConnection.targetHandle,
            });
        },
        [updateEdge]
    );

    // Connection mode handlers
    const onConnectStart = useCallback(() => {
        if (activeTool === 'connection') {
            // Add visual feedback when starting connection
            console.log('Connection started');
        }
    }, [activeTool]);

    const onConnectEnd = useCallback(() => {
        if (activeTool === 'connection') {
            // Clean up after connection attempt
            console.log('Connection ended');
        }
    }, [activeTool]);


    const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.stopPropagation();

        // 1. Calculate midpoint
        // This is a naive midpoint. For true visual midpoint we'd need the SVG path.
        // But for routing, creating it at click position is even better!
        const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

        // 2. Create Waypoint Node
        const waypointId = addNode('waypoint', position, '');

        if (!waypointId) return; // addNode should return ID, let's assume we update useStore to return it or generate it here.
        // Actually useStore.addNode currently returns void. We need to generate ID here to be safe or update store.
        // Let's manually generate ID to ensure we have it for edge creation.
        // Wait, useStore.addNode generates ID internally. We need to refactor addNode to return ID or handle it differently.
        // ALTERNATIVE: Use a predictable ID or just trust the store?
        // Let's update useStore to return ID! (Next step)

        // TEMPORARY FIX: We can't easily get the ID back right now without race conditions if we don't return it.
        // Let's assume we will update useStore.ts in the next step to return string.

        // 3. Delete old edge
        deleteEdgeFromStore(edge.id);

        // 4. Create two new edges
        const edge1Id = `edge-${edge.source}-${waypointId}-${Date.now()}_1`;
        const edge2Id = `edge-${waypointId}-${edge.target}-${Date.now()}_2`;

        // We need to wait for node to be added? No, state update batching might handle it, 
        // but adding edges to a non-existent node (in ReactFlow state) might warn.
        // Ideally we do this atomically.

        // 4. Create two new edges
        // We preserve the style/variant of the original edge
        const originalData = edge.data || {};

        addEdgeToStore({
            id: edge1Id,
            source: edge.source,
            target: waypointId,
            sourceHandle: edge.sourceHandle, // Keep original source handle
            targetHandle: undefined, // Connect to center of waypoint
            type: 'smoothstep',
            data: { ...originalData }
        });

        addEdgeToStore({
            id: edge2Id,
            source: waypointId,
            target: edge.target,
            sourceHandle: undefined, // Connect from center of waypoint
            targetHandle: edge.targetHandle, // Keep original target handle
            type: 'smoothstep',
            data: { ...originalData }
        });

    }, [screenToFlowPosition, addNode, deleteEdgeFromStore, addEdgeToStore]);

    // Custom connection line style
    const connectionLineStyle = {
        stroke: '#3B82F6',
        strokeWidth: 2,
        strokeDasharray: activeTool === 'connection' ? '5,5' : 'none',
    };

    const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
        navigateToNode(node.id);
    }, [navigateToNode]);

    const onNodeContextMenu: NodeMouseHandler = useCallback((event, node) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            type: 'node',
            id: node.id,
        });
    }, []);

    const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            type: 'edge',
            id: edge.id,
        });
    }, []);

    const handleDelete = useCallback(() => {
        if (!contextMenu) return;

        if (contextMenu.type === 'node') {
            deleteNode(contextMenu.id);
        } else {
            deleteEdgeFromStore(contextMenu.id);
        }
        setContextMenu(null);
    }, [contextMenu, deleteNode, deleteEdgeFromStore]);

    const handleUpdateEdge = useCallback((updates: any) => {
        if (contextMenu?.type === 'edge') {
            updateEdge(contextMenu.id, updates);
        }
    }, [contextMenu, updateEdge]);

    // Handle keyboard shortcuts (Delete, Ctrl+Z, Ctrl+Y)
    const { getNodes, getEdges } = useReactFlow();

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

            if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                undo();
                return;
            }

            if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.shiftKey && event.key === 'z'))) {
                event.preventDefault();
                redo();
                return;
            }

            if (!isInputFocused && (event.key === 'Delete' || event.key === 'Backspace' || event.key === 'x')) {
                // Use getNodes/getEdges to get fresh state without dependency cycles
                const currentNodes = getNodes();
                const currentEdges = getEdges();

                const selectedNodes = currentNodes.filter(n => n.selected);
                const selectedEdges = currentEdges.filter(e => e.selected);

                if (selectedNodes.length > 0 || selectedEdges.length > 0) {
                    event.preventDefault();

                    // Batch deletions if possible, but store handles singular
                    selectedNodes.forEach(node => {
                        deleteNode(node.id);
                    });

                    selectedEdges.forEach(edge => {
                        deleteEdgeFromStore(edge.id);
                    });
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [deleteNode, deleteEdgeFromStore, undo, redo, getNodes, getEdges]);

    const handleNodesChange: OnNodesChange = useCallback((changes) => {
        onNodesChange(changes);

        changes.forEach(change => {
            if (change.type === 'position') {
                if (change.dragging) {
                    isDraggingRef.current = true;
                } else {
                    isDraggingRef.current = false;
                    const updatedNode = nodes.find(n => n.id === change.id);
                    if (updatedNode) {
                        updateNode(change.id, { position: updatedNode.position });
                    }
                }
                // Remove 'remove' type handling here since we handle it globally
                //} else if (change.type === 'remove') {
                //    deleteNode(change.id);
            }
        });
    }, [onNodesChange, updateNode, deleteNode, nodes]);

    const handleEdgesChange: OnEdgesChange = useCallback((changes) => {
        onEdgesChange(changes);

        // Same for edges, manual handling covers it
        /*
        changes.forEach(change => {
            if (change.type === 'remove') {
                deleteEdgeFromStore(change.id);
            }
        });
        */
    }, [onEdgesChange, deleteEdgeFromStore]);

    const onMoveEnd = useCallback((_event: any, viewport: { x: number; y: number; zoom: number }) => {
        updateViewport(viewport);
    }, [updateViewport]);

    const onNodeDragStop = useCallback((_event: React.MouseEvent, node: Node) => {
        // 1. Get intersecting group nodes
        const intersections = getIntersectingNodes(node);
        const intersectingNodes = intersections.filter(n => n.type === 'group' && n.id !== node.id);
        const groupNode = intersectingNodes[0];

        // Get fresh node from store to ensure parentNode is current
        const freshNode = getNodes().find(n => n.id === node.id) || node;

        // 2. Check if we are dropping INTO a group
        if (groupNode) {
            // If ALREADY a child of this group, do nothing (ReactFlow handles the drag reflow)
            if (freshNode.parentNode === groupNode.id) {
                return;
            }

            // Calculate relative position based on absolute screen positions
            const nodeAbsPos = node.positionAbsolute || node.position; // Use the dragged node's current pos
            const groupAbsPos = groupNode.positionAbsolute || groupNode.position;

            if (!nodeAbsPos || !groupAbsPos) return;

            const relativeX = nodeAbsPos.x - groupAbsPos.x;
            const relativeY = nodeAbsPos.y - groupAbsPos.y;

            updateNode(node.id, {
                parentNode: groupNode.id,
                position: { x: relativeX, y: relativeY },
                extent: 'parent',
            });
        }
        // 3. Check if we are dragging OUT of a group (into empty space)
        else if (freshNode.parentNode) {
            // We are dragging out of a parent into the void
            const nodeAbsPos = node.positionAbsolute || node.position;

            updateNode(node.id, {
                parentNode: undefined,
                position: nodeAbsPos,
                extent: undefined
            });
        }
    }, [getIntersectingNodes, updateNode, getNodes]);

    const handleCommandAction = (action: string, _data?: any) => {
        const currentNodes = getNodes();
        const currentEdges = getEdges();

        switch (action) {
            // File operations
            case 'save':
                saveToIndexedDB();
                break;
            case 'export-json':
                // Export current graph as JSON
                const exportData = {
                    graphs,
                    currentGraphId,
                    exportedAt: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `architecture-${currentGraphId}-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                break;
            case 'export-png':
                // TODO: Implement PNG export using html-to-image or similar
                alert('PNG export coming soon!');
                break;
            case 'import':
                // TODO: Implement import from JSON
                alert('Import coming soon!');
                break;

            // View operations
            case 'fit-view':
                fitView({ duration: 300, padding: 0.2 });
                break;
            case 'zoom-in':
                zoomIn({ duration: 300 });
                break;
            case 'zoom-out':
                zoomOut({ duration: 300 });
                break;
            case 'toggle-lock':
                toggleViewLock();
                break;
            case 'toggle-theme':
                toggleTheme();
                break;
            case 'toggle-grid':
                // Grid is always visible, but could toggle background variant
                break;

            // Node operations
            case 'add-node':
                const centerPosition = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                addNode('service', centerPosition, 'New Node');
                break;
            case 'duplicate':
                // Duplicate selected nodes
                const selectedNodes = currentNodes.filter(n => n.selected);
                selectedNodes.forEach(node => {
                    const newPosition = {
                        x: node.position.x + 50,
                        y: node.position.y + 50
                    };
                    addNode(node.type as any, newPosition, `${node.data.label} (Copy)`);
                });
                break;
            case 'delete-selection':
                currentNodes.filter(n => n.selected).forEach(node => deleteNode(node.id));
                currentEdges.filter(e => e.selected).forEach(edge => deleteEdgeFromStore(edge.id));
                break;
            case 'group-selection':
                // TODO: Implement grouping of selected nodes
                alert('Group selection coming soon!');
                break;

            // Navigation
            case 'navigate-back':
                navigateBack();
                break;
            case 'view-graphs':
                // TODO: Show graph navigation dialog
                alert('Graph navigation coming soon!');
                break;
            case 'clear-canvas':
                if (confirm('Are you sure you want to clear the entire canvas? This cannot be undone.')) {
                    clearCurrentGraph();
                }
                break;

            // Edit operations
            case 'undo':
                undo();
                break;
            case 'redo':
                redo();
                break;
            case 'select-all':
                // Select all nodes
                setNodes(currentNodes.map(n => ({ ...n, selected: true })));
                break;

            // Help
            case 'show-shortcuts':
                // TODO: Show keyboard shortcuts modal
                alert('Keyboard shortcuts guide coming soon!');
                break;
        }
    };

    if (!currentGraph) {
        return (
            <div className="flex items-center justify-center h-full bg-dark-bg text-gray-400">
                Loading...
            </div>
        );
    }

    return (
        <div
            className="h-full w-full bg-dark-bg"
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onNodeDoubleClick={onNodeDoubleClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onNodeDragStop={onNodeDragStop}
                onMoveEnd={onMoveEnd}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapToGrid
                snapGrid={[15, 15]}
                defaultViewport={currentGraph.viewport}
                minZoom={0.1}
                maxZoom={4}
                nodesDraggable={activeTool === 'select'}
                nodesConnectable={true}
                elementsSelectable={activeTool === 'select' || activeTool === 'connection'}
                className={`bg-dark-bg ${activeTool === 'connection' || activeTool === 'text' ? 'cursor-crosshair' : 'cursor-default'}`}
                onPaneClick={onPaneClick}
                connectionLineStyle={connectionLineStyle}
                connectionLineType={ConnectionLineType.SmoothStep}
                connectionMode={ConnectionMode.Loose}
                edgesUpdatable={activeTool === 'connection'}
                onEdgeUpdate={onEdgeUpdate}
                onEdgeDoubleClick={onEdgeDoubleClick}
                panOnDrag={!viewLocked}
                zoomOnScroll={!viewLocked}
                zoomOnPinch={!viewLocked}
                zoomOnDoubleClick={!viewLocked}
                deleteKeyCode={null}
            >
                <Background
                    color="#27272a" // Zinc 800 for subtler dots
                    gap={24}
                    size={1.5}
                    variant={BackgroundVariant.Dots}
                    className="bg-dark-bg"
                />
                <MiniMap
                    nodeColor={(node) => {
                        // Color nodes by type/category for better visualization
                        if (node.type === 'condition') return '#f59e0b'; // Amber for condition
                        if (node.type === 'group') return '#6b7280'; // Gray for groups
                        return '#3B82F6'; // Blue default
                    }}
                    maskColor={theme === 'dark' ? 'rgba(9, 9, 11, 0.85)' : 'rgba(255, 255, 255, 0.85)'}
                    className={`!rounded-lg !shadow-xl !border ${theme === 'dark'
                        ? '!bg-zinc-900 !border-zinc-700'
                        : '!bg-white !border-gray-200'
                        }`}
                    style={{
                        backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                    }}
                    nodeStrokeWidth={theme === 'dark' ? 2 : 1}
                    nodeBorderRadius={4}
                    zoomable
                    pannable
                />

                <Panel position="top-left" className="pointer-events-auto">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-zinc-900/95 to-zinc-800/95 backdrop-blur-sm rounded-lg border border-zinc-700 shadow-xl">
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-accent-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            <span className="text-xl font-bold bg-gradient-to-r from-accent-blue to-cyan-400 bg-clip-text text-transparent tracking-tight">
                                FractalFlow
                            </span>
                        </div>
                    </div>
                </Panel>

                <Panel position="top-right" className="pointer-events-auto">
                    <KeymapGuide />
                </Panel>
                <Panel position="top-center" className="mt-4 pointer-events-auto">
                    <TopNavigationDock />
                </Panel>
            </ReactFlow>

            {
                contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        type={contextMenu.type}
                        onDelete={handleDelete}
                        onRename={() => {
                            setContextMenu(null);
                        }}
                        onZoomIn={() => {
                            navigateToNode(contextMenu.id);
                            setContextMenu(null);
                        }}
                        onEdgeUpdate={handleUpdateEdge}
                        onClose={() => setContextMenu(null)}
                    />
                )
            }
            <CommandPalette onAction={handleCommandAction} />
        </div >
    );
};

export const MainCanvas: React.FC<{ activeTool: string }> = ({ activeTool }) => {
    return (
        <ReactFlowProvider>
            <CanvasInner activeTool={activeTool} />
        </ReactFlowProvider>
    );
};
