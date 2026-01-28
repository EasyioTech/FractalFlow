import React from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import { useStore } from '../../store/useStore';

export const DynamicHandles: React.FC = () => {
    const nodeId = useNodeId();
    const { graphs, currentGraphId } = useStore();

    if (!nodeId) return null;

    const currentGraph = graphs[currentGraphId];
    const node = currentGraph?.nodes.find(n => n.id === nodeId);

    if (!node) return null;

    // Check if this is a Diamond/Condition node
    const isDiamond = node.type === 'condition';

    // For Diamond nodes, provide labeled Yes/No handles
    if (isDiamond) {
        return (
            <>
                {/* Input handle at top */}
                <Handle
                    type="target"
                    position={Position.Top}
                    id="top"
                    className="w-3 h-3 !bg-accent-blue border-2 border-white shadow-md"
                    style={{ top: '-6px' }}
                />

                {/* Yes handle on right */}
                <Handle
                    type="source"
                    position={Position.Right}
                    id="yes"
                    className="w-3 h-3 !bg-green-500 border-2 border-white shadow-md"
                    style={{ right: '-6px' }}
                />
                <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-600 dark:text-green-400 pointer-events-none">
                    YES
                </div>

                {/* No handle on bottom */}
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="no"
                    className="w-3 h-3 !bg-red-500 border-2 border-white shadow-md"
                    style={{ bottom: '-6px' }}
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-red-600 dark:text-red-400 pointer-events-none">
                    NO
                </div>
            </>
        );
    }

    // Standard 4-directional handles for all other nodes
    // Using multiple handles per side for better connection flexibility
    const renderSideHandles = (side: 'top' | 'right' | 'bottom' | 'left') => {
        let position = Position.Top;
        let styleBase: React.CSSProperties = {};

        switch (side) {
            case 'top':
                position = Position.Top;
                styleBase = { top: '-4px' };
                break;
            case 'bottom':
                position = Position.Bottom;
                styleBase = { bottom: '-4px' };
                break;
            case 'left':
                position = Position.Left;
                styleBase = { left: '-4px' };
                break;
            case 'right':
                position = Position.Right;
                styleBase = { right: '-4px' };
                break;
        }

        const isVertical = side === 'left' || side === 'right';

        return [25, 50, 75].map((offset) => {
            const id = `${side}-${offset}`;
            const style = { ...styleBase };

            if (isVertical) {
                style.top = `${offset}%`;
            } else {
                style.left = `${offset}%`;
            }

            return (
                <Handle
                    key={id}
                    id={id}
                    type="source"
                    position={position}
                    className="!w-2 !h-2 rounded-full border-0 transition-all duration-200 opacity-0 group-hover:opacity-60 bg-accent-blue z-50"
                    style={style}
                />
            );
        });
    };

    return (
        <>
            {renderSideHandles('top')}
            {renderSideHandles('right')}
            {renderSideHandles('bottom')}
            {renderSideHandles('left')}
        </>
    );
};
