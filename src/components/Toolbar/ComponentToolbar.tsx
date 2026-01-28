import React, { useState } from 'react';
import { ChevronDown, Search, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NodeType } from '../../types';
import { useStore } from '../../store/useStore';
import { COMPONENT_LIBRARY, COMPONENT_CATEGORIES, ICON_MAP, ComponentCategory } from '../../config/componentLibrary';

export const ComponentToolbar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { addNode } = useStore();
    const [expandedCategories, setExpandedCategories] = useState<Record<ComponentCategory, boolean>>({
        'compute': true,
        'storage': true,
        'networking': true,
        'flowchart': true,
        'cloud-aws': false,
        'cloud-azure': false,
        'devops': false,
        'external': false,
        'user-flow': false,
        'grouping': false
    });
    const [searchQuery, setSearchQuery] = useState('');

    const toggleCategory = (category: ComponentCategory) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleAddComponent = (type: NodeType, label: string) => {
        const randomOffset = () => Math.random() * 100 - 50;
        addNode(type, { x: 250 + randomOffset(), y: 250 + randomOffset() }, label);
    };

    const handleDragStart = (e: React.DragEvent, type: NodeType, label: string) => {
        // Set the data to transfer
        e.dataTransfer.setData('application/reactflow', JSON.stringify({ type, label }));
        e.dataTransfer.effectAllowed = 'move';
    };



    // Filter components based on search
    const filteredComponents = COMPONENT_LIBRARY.filter(comp =>
        comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group components by category
    const groupedComponents = filteredComponents.reduce((acc, component) => {
        if (!acc[component.category]) {
            acc[component.category] = [];
        }
        acc[component.category].push(component);
        return acc;
    }, {} as Record<ComponentCategory, typeof COMPONENT_LIBRARY>);

    return (
        <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full flex flex-col bg-dark-surface/90 backdrop-blur-xl border-r border-white/10 shadow-2xl relative z-30 overflow-hidden"
        >
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Box className="w-6 h-6 text-accent-blue" />
                        Components
                    </h2>
                    <div className="flex gap-2">
                        {/* Clear button moved to TopNavigationDock */}
                    </div>
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-accent-blue transition-colors" />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-gray-200 
                                 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 focus:bg-white dark:focus:bg-black/40
                                 placeholder:text-gray-500 dark:placeholder:text-gray-600 transition-all duration-200"
                    />
                </div>
            </div>

            {/* Component List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {COMPONENT_CATEGORIES.map((category) => {
                    const categoryComponents = groupedComponents[category.id] || [];
                    if (categoryComponents.length === 0 && searchQuery) return null;

                    const isExpanded = expandedCategories[category.id] || searchQuery.length > 0;

                    return (
                        <div key={category.id} className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: category.color, color: category.color }} />
                                    {category.label}
                                </div>
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                    >
                                        <div className="px-2 pb-2 grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                                            {categoryComponents.map((component) => {
                                                const Icon = ICON_MAP[component.iconName];
                                                if (!Icon) return null;

                                                return (
                                                    <button
                                                        key={component.type}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, component.type as NodeType, component.label)}
                                                        onClick={() => handleAddComponent(component.type as NodeType, component.label)}
                                                        className="flex flex-col items-center justify-center p-3 rounded-lg border border-transparent 
                                                                 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 hover:border-accent-blue/30 hover:shadow-lg hover:-translate-y-0.5
                                                                 transition-all duration-200 group relative overflow-hidden cursor-grab active:cursor-grabbing"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <Icon className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-accent-blue transition-colors relative z-10" />
                                                        <span className="text-[10px] text-center text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate w-full relative z-10 font-medium tracking-wide">
                                                            {component.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Hint */}
            <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="text-xs text-gray-500 text-center">
                    Drag components to canvas or click to add.
                </div>
            </div>
        </motion.div>
    );
};
