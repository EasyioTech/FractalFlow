import React from 'react';
import { Minus, Activity, Trash2, GitMerge, CornerDownRight, Slash } from 'lucide-react';

interface EdgeContextMenuProps {
    onUpdate: (updates: any) => void;
    onDelete: () => void;
    onClose: () => void;
}

export const EdgeContextMenu: React.FC<EdgeContextMenuProps> = ({ onUpdate, onDelete, onClose }) => {
    return (
        <>
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 font-medium uppercase tracking-wider">Line Shape</div>

            <button
                onClick={() => { onUpdate({ type: 'default' }); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors group"
            >
                <Activity className="w-4 h-4 text-gray-400 group-hover:text-accent-blue" />
                Bezier Curve
            </button>

            <button
                onClick={() => { onUpdate({ type: 'step' }); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors group"
            >
                <CornerDownRight className="w-4 h-4 text-gray-400 group-hover:text-accent-blue" />
                Right Angle (Step)
            </button>

            <button
                onClick={() => { onUpdate({ type: 'straight' }); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors group"
            >
                <Slash className="w-4 h-4 text-gray-400 group-hover:text-accent-blue" />
                Straight Line
            </button>
            <button
                onClick={() => { onUpdate({ type: 'smoothstep' }); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors group"
            >
                <GitMerge className="w-4 h-4 text-gray-400 group-hover:text-accent-blue" />
                Easy Step
            </button>

            <div className="my-1 border-t border-gray-100 dark:border-dark-border" />
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 font-medium uppercase tracking-wider">Line Style</div>

            <button
                onClick={() => { onUpdate({ data: { variant: 'default' }, animated: false, style: { strokeDasharray: 'none' } }); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors group"
            >
                <Minus className="w-4 h-4 text-gray-400 group-hover:text-accent-blue" />
                Solid
            </button>

            <button
                onClick={() => { onUpdate({ data: { variant: 'dashed' }, animated: false, style: { strokeDasharray: '5,5' } }); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors group"
            >
                <Minus className="w-4 h-4 border-b border-dashed text-gray-400 group-hover:text-accent-blue" />
                Dashed
            </button>

            <button
                onClick={() => { onUpdate({ data: { variant: 'dotted' }, animated: true, style: { strokeDasharray: '2,2' } }); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors group"
            >
                <div className="flex gap-0.5 items-center w-4 overflow-hidden">
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                </div>
                Animated Dotted
            </button>

            <div className="my-1 border-t border-gray-100 dark:border-dark-border" />

            <button
                onClick={() => { onDelete(); onClose(); }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                Delete Connection
            </button>
        </>
    );
};
