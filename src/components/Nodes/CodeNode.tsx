import React, { memo, useState, useRef, useEffect } from 'react';
import { NodeProps } from 'reactflow';
import { useStore } from '../../store/useStore';
import { DynamicHandles } from '../Handles/DynamicHandles';

export const CodeNode: React.FC<NodeProps> = memo(({ data, id, selected }) => {
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
        <div className="relative group/code h-full w-full flex flex-col">

            <div
                className="flex-1 min-h-[60px] bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden shadow-sm flex flex-col"
                onDoubleClick={handleDoubleClick}
            >
                <div className="bg-white/[0.03] px-3 py-2 flex items-center justify-between border-b border-dark-border/50">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        <div className="flex gap-1.5 mr-2 opacity-50">
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                        </div>
                        snippet
                    </div>
                </div>
                <div className="flex-1 p-3 bg-black/20 overflow-hidden">
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={handleBlur}
                            className="w-full h-full bg-transparent text-accent-blue/90 resize-none outline-none font-mono text-sm leading-relaxed"
                            spellCheck={false}
                        />
                    ) : (
                        <pre className="w-full h-full text-gray-300 font-mono text-sm overflow-hidden whitespace-pre-wrap leading-relaxed">
                            <code className="block w-full h-full">{data.label || "// add your code here"}</code>
                        </pre>
                    )}
                </div>
            </div>
            {/* Dynamic Granular Handles */}
            <DynamicHandles />
        </div>
    );
});
