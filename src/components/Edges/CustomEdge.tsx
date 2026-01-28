import React, { FC, useState, useRef, useEffect, memo } from 'react';
import { EdgeProps, getSmoothStepPath, getBezierPath, getStraightPath, getSimpleBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';
import { Edit2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CustomEdge: FC<EdgeProps> = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    markerStart,
    style,
    selected,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data?.label || '');
    const [showTooltip, setShowTooltip] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { updateEdge } = useStore();

    // Determine which path algorithm to use
    // If 'type' prop was passed to CustomEdge, we could use it, but CustomEdge is usually mapped FROM a type.
    // However, since we map ALL types to CustomEdge in MainCanvas, we must rely on data.variant OR the component type passed down?
    // ReactFlow passes 'type'?? No, it renders the component associated with the type.
    // So we should check data.type if we are storing it there, OR we separate components.
    // Better: Allow CustomEdge to handle dynamic path type via data.pathType 

    // Defaulting to smoothstep if not specified
    const pathType = data?.pathType || 'smoothstep';

    let getPath = getSmoothStepPath;
    if (pathType === 'default' || pathType === 'bezier') getPath = getBezierPath;
    else if (pathType === 'straight') getPath = getStraightPath;
    else if (pathType === 'step') getPath = getSmoothStepPath; // ReactFlow doesn't have a rigid Step path built-in simpler than smoothstep, but smoothstep with 0 borderRadius is step.
    else if (pathType === 'simple_bezier') getPath = getSimpleBezierPath;

    const [edgePath, labelX, labelY] = getPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        // borderRadius: pathType === 'step' ? 0 : 5, // Optional: sharper corners for 'step'
    });

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleLabelDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
    };

    const handleLabelBlur = () => {
        setIsEditing(false);
        if (label !== data?.label) {
            // Save the updated label to the store
            updateEdge(id, {
                data: {
                    ...data,
                    label: label
                }
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setLabel(data?.label || '');
            setIsEditing(false);
        }
    };

    const edgeColor = data?.color || style?.stroke || '#3B82F6';

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                markerEnd={markerEnd}
                markerStart={markerStart}
                style={{
                    ...style,
                    stroke: edgeColor,
                    strokeWidth: selected ? 3 : 2,
                    filter: selected ? `drop-shadow(0 0 4px ${edgeColor})` : 'none',
                }}
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={label}
                            onChange={handleLabelChange}
                            onBlur={handleLabelBlur}
                            onKeyDown={handleKeyDown}
                            className="px-2 py-1 text-xs font-medium bg-dark-surface border border-accent-blue rounded shadow-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/50"
                            style={{ minWidth: '60px' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <div
                            onDoubleClick={handleLabelDoubleClick}
                            className={`
                                group px-2 py-1 text-xs font-medium rounded shadow-md cursor-pointer
                                transition-all duration-200
                                ${selected ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue' : 'bg-dark-surface/90 text-gray-300 border border-dark-border'}
                                hover:bg-accent-blue/10 hover:border-accent-blue/50
                            `}
                            style={{
                                backdropFilter: 'blur(8px)',
                            }}
                        >
                            <div className="flex items-center gap-1">
                                {label || (
                                    <span className="text-gray-500 italic">
                                        {selected ? 'Double-click to label' : ''}
                                    </span>
                                )}
                                {selected && !isEditing && (
                                    <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </div>

                            {showTooltip && data?.metadata && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 rounded-lg shadow-xl text-white text-xs whitespace-nowrap z-50">
                                    {data.metadata.protocol && <div><strong>Protocol:</strong> {data.metadata.protocol}</div>}
                                    {data.metadata.dataType && <div><strong>Data Type:</strong> {data.metadata.dataType}</div>}
                                    {data.metadata.relationship && <div><strong>Relationship:</strong> {data.metadata.relationship}</div>}
                                    {data.metadata.latency && <div><strong>Latency:</strong> {data.metadata.latency}</div>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
});

CustomEdge.displayName = 'CustomEdge';
