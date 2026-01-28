import React, { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';

export const GroupNode: React.FC<NodeProps> = memo(({ data, selected }) => {
    return (
        <div className="relative group/box h-full w-full">
            <NodeResizer
                minWidth={150}
                minHeight={150}
                isVisible={selected}
                lineClassName="border-accent-blue/50"
                handleClassName="h-3 w-3 bg-accent-blue border-2 border-white rounded shadow-sm"
            />
            <div className={`h-full w-full rounded-2xl border-2 border-dashed border-white/10 
                           bg-white/[0.02] backdrop-blur-[2px] p-6 transition-all duration-300 
                           ${selected ? 'border-accent-blue/40 bg-accent-blue/[0.03]' : 'hover:border-white/20 hover:bg-white/[0.04]'}`}>
                <div className="absolute -top-3 left-4 bg-dark-surface border border-dark-border px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-lg">
                    {data.label || 'Group'}
                </div>
            </div>
        </div>
    );
});
