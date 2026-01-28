import React, { useEffect, useRef } from 'react';
import { Trash2, Edit2, ZoomIn } from 'lucide-react';
import { EdgeContextMenu } from './EdgeContextMenu';

interface ContextMenuProps {
    x: number;
    y: number;
    type: 'node' | 'edge';
    onDelete: () => void;
    // Node props
    onRename?: () => void;
    onZoomIn?: () => void;
    // Edge props
    onEdgeUpdate?: (updates: any) => void;
    onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    type,
    onDelete,
    onRename,
    onZoomIn,
    onEdgeUpdate,
    onClose,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg shadow-xl py-1 min-w-[180px]"
            style={{ left: `${x}px`, top: `${y}px` }}
        >
            {type === 'node' && (
                <>
                    <button
                        onClick={() => { onZoomIn?.(); onClose(); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors"
                    >
                        <ZoomIn className="w-4 h-4 text-accent-blue" />
                        Zoom Into Component
                    </button>

                    <button
                        onClick={() => { onRename?.(); onClose(); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-accent-blue/10 flex items-center gap-3 transition-colors"
                    >
                        <Edit2 className="w-4 h-4 text-accent-blue" />
                        Rename
                    </button>
                </>
            )}

            {type === 'edge' && onEdgeUpdate && (
                <EdgeContextMenu
                    onUpdate={onEdgeUpdate}
                    onDelete={onDelete}
                    onClose={onClose}
                />
            )}

            {type === 'node' && (
                <>
                    <div className="my-1 border-t border-gray-100 dark:border-dark-border" />
                    <button
                        onClick={() => { onDelete(); onClose(); }}
                        className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Node
                    </button>
                </>
            )}
        </div>
    );
};
