import React, { memo, useState, useRef, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import { useStore } from '../../store/useStore';
import { DynamicHandles } from '../Handles/DynamicHandles';

export const TextNode: React.FC<NodeProps> = memo(({ data, id, selected }) => {
    const { updateNode } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(data.label);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setValue(data.label);
    }, [data.label]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (value.trim() && value !== data.label) {
            updateNode(id, { data: { ...data, label: value.trim() } });
        } else {
            setValue(data.label);
        }
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    return (
        <div className="relative group/text h-full w-full">

            <div
                className={`h-full w-full min-h-[40px] px-3 py-2 transition-colors duration-200 
                           rounded-md border border-gray-200 dark:border-white/10
                           bg-white/80 dark:bg-black/20 backdrop-blur-sm
                           ${selected ? 'ring-1 ring-accent-blue/50' : 'hover:border-accent-blue/30'}
                           `}
                onDoubleClick={handleDoubleClick}
            >
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                textareaRef.current?.blur();
                            }
                        }}
                        className="w-full h-full bg-transparent text-gray-900 dark:text-gray-200 resize-none outline-none font-sans text-sm"
                        style={{ minHeight: '100%' }}
                        spellCheck={false}
                    />
                ) : (
                    <div className="w-full h-full text-gray-900 dark:text-gray-200 font-sans text-sm whitespace-pre-wrap leading-relaxed">
                        {data.label || "Double click to edit text"}
                    </div>
                )}
            </div>
            {/* Dynamic Granular Handles */}
            <DynamicHandles />
        </div>
    );
});
