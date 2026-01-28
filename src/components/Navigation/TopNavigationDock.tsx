import React from 'react';
import { ChevronRight, Home, Layout, ZoomIn, ZoomOut, Maximize, Lock, Unlock, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { useReactFlow } from 'reactflow';

export const TopNavigationDock: React.FC = () => {
    const { navigationStack, graphs, navigateToGraph, viewLocked, toggleViewLock, clearCurrentGraph, currentGraphId } = useStore();
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    const handleClearCanvas = () => {
        const currentGraph = graphs[currentGraphId];
        const nodeCount = currentGraph?.nodes.length || 0;

        if (nodeCount === 0) return;

        if (window.confirm(`Clear all ${nodeCount} node(s) and connections from this canvas?`)) {
            clearCurrentGraph();
        }
    };

    const navigateToLevel = (targetIndex: number) => {
        const targetGraphId = navigationStack[targetIndex];
        navigateToGraph(targetGraphId);
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4 p-2 pl-4 pr-4 rounded-full bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border border-black/5 dark:border-dark-border/50 shadow-xl-lift ring-1 ring-black/5 dark:ring-white/5"
        >
            {/* Project Title */}
            <div className="flex items-center gap-2 border-r border-black/5 dark:border-white/10 pr-4">
                <div className="p-1.5 rounded-lg bg-accent-blue/10 text-accent-blue">
                    <Layout className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
                    System Architecture
                </span>
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1">
                {navigationStack.map((graphId, index) => {
                    const graph = graphs[graphId];
                    const isLast = index === navigationStack.length - 1;
                    const isFirst = index === 0;

                    return (
                        <div key={graphId} className="flex items-center gap-1">
                            {index > 0 && (
                                <ChevronRight className="w-3 h-3 text-gray-600 mx-1" />
                            )}

                            <button
                                onClick={() => navigateToLevel(index)}
                                disabled={isLast}
                                className={`
                                    flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                                    ${isLast
                                        ? 'text-gray-800 dark:text-gray-200 bg-black/5 dark:bg-white/5 cursor-default'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                                    }
                                `}
                            >
                                {isFirst && <Home className="w-3 h-3" />}
                                <span className={isLast ? '' : 'truncate max-w-[100px]'}>
                                    {graph?.name || 'System Overview'}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-2" />

            {/* View Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => zoomOut({ duration: 300 })}
                    className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <button
                    onClick={() => zoomIn({ duration: 300 })}
                    className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
                <button
                    onClick={() => fitView({ duration: 300, padding: 0.2 })}
                    className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    title="Fit to View"
                >
                    <Maximize className="w-4 h-4" />
                </button>
                <button
                    onClick={toggleViewLock}
                    className={`p-1.5 rounded-md transition-colors ${viewLocked
                        ? 'text-accent-blue bg-accent-blue/10 dark:bg-accent-blue/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`
                    }
                    title={viewLocked ? "Unlock View" : "Lock View"}
                >
                    {viewLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />
                <button
                    onClick={handleClearCanvas}
                    className="p-1.5 rounded-md text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Clear Canvas"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};
