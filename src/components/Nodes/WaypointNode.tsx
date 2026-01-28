import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { CustomNodeWrapper } from '../CustomNodeWrapper';

export const WaypointNode: React.FC<NodeProps> = memo(({ selected, dragging }) => {
    return (
        <CustomNodeWrapper
            selected={selected}
            dragging={dragging}
            className="w-4 h-4 rounded-full bg-accent-blue flex items-center justify-center shadow-md ring-2 ring-white/10"
        >
            <div className={`w-1.5 h-1.5 rounded-full bg-white ${selected ? 'scale-110' : ''}`} />

            {/* Connecting handles on all 4 sides to ensure connectivity from any direction */}
            <Handle type="source" position={Position.Top} className="opacity-0" />
            <Handle type="source" position={Position.Right} className="opacity-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
            <Handle type="source" position={Position.Left} className="opacity-0" />
        </CustomNodeWrapper>
    );
});
