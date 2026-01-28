import React, { useState, useRef, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import { Edit2, Box, Trash2 } from 'lucide-react'; // Added Trash2
import { useStore } from '../../store/useStore';
import { COMPONENT_LIBRARY, COMPONENT_CATEGORIES, ICON_MAP } from '../../config/componentLibrary';
import { CustomNodeWrapper } from '../CustomNodeWrapper';
import { DynamicHandles } from '../Handles/DynamicHandles';


export const ArchNode: React.FC<NodeProps> = ({ data, id, dragging, selected }) => {
    const hasNestedGraph = !!data.childGraphId;
    const { updateNode, deleteNode } = useStore(); // Added deleteNode

    // Find component config based on data.icon (which stores the type)
    const componentConfig = COMPONENT_LIBRARY.find(c => c.type === data.icon);

    // Get Icon component
    const IconComponent = componentConfig ? ICON_MAP[componentConfig.iconName] : Box;

    // Get Category Color
    const categoryConfig = COMPONENT_CATEGORIES.find(c => c.id === componentConfig?.category);
    const accentColor = categoryConfig ? categoryConfig.color : '#3B82F6'; // Default blue

    const [isEditing, setIsEditing] = useState(false);
    const [labelValue, setLabelValue] = useState(data.label);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Sync local state with prop when data changes from store
    useEffect(() => {
        setLabelValue(data.label);
    }, [data.label]);

    const handleLabelClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabelValue(e.target.value);
    };

    const handleLabelBlur = () => {
        setIsEditing(false);
        if (labelValue.trim() && labelValue !== data.label) {
            updateNode(id, {
                data: {
                    ...data,
                    label: labelValue.trim(),
                },
            });
        } else {
            setLabelValue(data.label);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setLabelValue(data.label);
            setIsEditing(false);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteNode(id);
    };

    const isSelected = selected; // Use prop directly
    const isCircle = componentConfig?.iconName === 'Circle';
    const isDiamond = componentConfig?.iconName === 'Diamond';

    // Shape-specific classes
    let containerClasses = `
        relative box-border transition-all duration-200
        group
        ${hasNestedGraph ? 'ring-2 ring-accent-blue/50' : ''}
    `;

    // Min dimensions are handled by NodeResizer or default style
    // We need to ensure content centers properly in new size
    if (isCircle) {
        containerClasses += ' rounded-full flex items-center justify-center border-2 border-gray-300 dark:border-white/10 bg-white dark:bg-dark-surface overflow-visible aspect-square min-w-[100px] min-h-[100px]';
    } else if (isDiamond) {
        containerClasses += ' rotate-45 flex items-center justify-center border-2 border-amber-400 dark:border-amber-500 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 overflow-visible aspect-square min-w-[120px] min-h-[120px] shadow-lg';
    } else {
        // Standard Card Style
        containerClasses += ' rounded-xl bg-white dark:bg-dark-surface min-w-[200px] overflow-hidden shadow-sm hover:shadow-md';
    }

    return (
        <CustomNodeWrapper
            selected={isSelected}
            dragging={dragging}
            className={containerClasses}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Selection Glow */}
            {isSelected && (
                <div className={`absolute -inset-0.5 ${isCircle ? 'rounded-full' : isDiamond ? '' : 'rounded-xl'} ring-2 ${isDiamond ? 'ring-amber-500' : 'ring-accent-blue'} shadow-[0_0_20px_rgba(59,130,246,0.3)] pointer-events-none z-0`} />
            )}

            {/* Standard "Card" Node Layout */}
            {!isDiamond && !isCircle ? (
                <div className="flex flex-col h-full w-full relative z-10">
                    {/* Header Bar */}
                    <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: accentColor }}
                    />

                    {/* Header Content */}
                    <div className="flex items-center justify-between px-3 pt-3 pb-1">
                        {/* Icon Container */}
                        <div
                            className="p-2 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center"
                            style={{ color: accentColor }}
                        >
                            <IconComponent className="w-5 h-5" />
                        </div>

                        {/* Actions (Delete) - Visible on Hover or Selection */}
                        <div className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                            <button
                                onClick={handleDelete}
                                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Delete Node (x)"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Body Content */}
                    <div className="px-3 pb-4 pt-1">
                        <div className="flex flex-col">
                            {/* Editable Label */}
                            {isEditing ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={labelValue}
                                    onChange={handleLabelChange}
                                    onBlur={handleLabelBlur}
                                    onKeyDown={handleKeyDown}
                                    className="w-full text-sm font-bold text-gray-900 dark:text-white bg-transparent 
                                             border-b border-accent-blue/50
                                             focus:outline-none focus:border-accent-blue px-0 py-0.5"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <div
                                    onClick={handleLabelClick}
                                    className="group/label cursor-text flex items-center gap-1.5"
                                >
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{data.label}</span>
                                    <Edit2 className="w-3 h-3 text-gray-400 opacity-0 group-hover/label:opacity-100 transition-opacity shrink-0" />
                                </div>
                            )}

                            {/* Type / Category */}
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                                {componentConfig?.label || data.icon}
                            </span>
                        </div>
                    </div>

                    {/* Nested Graph Indicator */}
                    {hasNestedGraph && (
                        <div className="absolute top-2 right-2 flex gap-1">
                            <div
                                className="p-1 rounded-full bg-accent-blue/10 text-accent-blue"
                                title="Has child graph"
                            >
                                <Box className="w-3 h-3" />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Shape Node Layout (Diamond/Circle) */
                <div className={`flex flex-col items-center justify-center w-full h-full relative z-10 ${isDiamond ? '-rotate-45' : ''}`}>

                    {/* Delete Button for Shapes - Floating */}
                    <div
                        className={`absolute -top-8 left-1/2 -translate-x-1/2 transition-all duration-200 ${isHovered || isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
                    >
                        <button
                            onClick={handleDelete}
                            className="p-1.5 rounded-full bg-dark-surface border border-dark-border text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-lg"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Question Mark Icon for Diamond */}
                    {isDiamond && (
                        <div className="mb-1 p-1.5 rounded-full bg-amber-500/20 dark:bg-amber-400/20">
                            <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}

                    {!isDiamond && <IconComponent className="w-6 h-6 mb-1 opacity-50" style={{ color: accentColor }} />}

                    {isEditing ? (
                        <input
                            ref={inputRef}
                            type="text"
                            value={labelValue}
                            onChange={handleLabelChange}
                            onBlur={handleLabelBlur}
                            onKeyDown={handleKeyDown}
                            className={`w-[80%] text-xs font-bold bg-transparent 
                                     border-b text-center
                                     focus:outline-none px-0 py-0.5
                                     ${isDiamond
                                    ? 'text-amber-900 dark:text-amber-100 border-amber-500'
                                    : 'text-gray-900 dark:text-white border-accent-blue/50'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <div
                            onClick={handleLabelClick}
                            className="text-center w-[90%] px-1 cursor-text"
                        >
                            <span className={`text-xs font-bold block truncate leading-tight ${isDiamond
                                ? 'text-amber-900 dark:text-amber-100'
                                : 'text-gray-900 dark:text-gray-100'
                                }`}>
                                {data.label}
                            </span>
                        </div>
                    )}

                    {isDiamond && (
                        <div className="mt-0.5 text-[8px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider opacity-70">
                            Decision
                        </div>
                    )}
                </div>
            )}

            {/* Dynamic Granular Handles */}
            <DynamicHandles />
        </CustomNodeWrapper>
    );
};
