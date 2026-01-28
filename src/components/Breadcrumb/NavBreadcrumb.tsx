import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const NavBreadcrumb: React.FC = () => {
    const { navigationStack, graphs, navigateBack, navigateToGraph } = useStore();

    const navigateToLevel = (targetIndex: number) => {
        const targetGraphId = navigationStack[targetIndex];
        navigateToGraph(targetGraphId);
    };

    return (
        <div className="flex items-center gap-2 px-4 py-3 bg-dark-bg border-b border-dark-border">
            <div className="flex items-center gap-2">
                {navigationStack.map((graphId, index) => {
                    const graph = graphs[graphId];
                    const isLast = index === navigationStack.length - 1;
                    const isFirst = index === 0;

                    return (
                        <div key={graphId} className="flex items-center gap-2">
                            <button
                                onClick={() => navigateToLevel(index)}
                                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg
                  transition-all duration-200
                  ${isLast
                                        ? 'text-accent-blue font-medium bg-accent-blue/10'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-surface'
                                    }
                `}
                            >
                                {isFirst && <Home className="w-4 h-4" />}
                                <span className="text-sm">
                                    {graph?.name || 'System Overview'}
                                </span>
                            </button>
                            {!isLast && <ChevronRight className="w-4 h-4 text-gray-600" />}
                        </div>
                    );
                })}
            </div>

            {navigationStack.length > 1 && (
                <div className="ml-auto">
                    <button
                        onClick={() => navigateBack()}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 
                     bg-dark-surface hover:bg-dark-border rounded-lg
                     transition-all duration-200 border border-dark-border"
                    >
                        ← Back
                    </button>
                </div>
            )}
        </div>
    );
};
