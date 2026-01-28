import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MousePointer2,
    Share2,
    Undo,
    Redo,
    Box,
    Type,
    Sun,
    Moon
} from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../store/useStore';

interface FloatingDockProps {
    activeTool: string;
    onToolSelect: (tool: string) => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ activeTool, onToolSelect }) => {
    const { undo, redo, theme, toggleTheme } = useStore();

    const tools = [
        { id: 'select', icon: MousePointer2, label: 'Select' },
        { id: 'rectangle', icon: Box, label: 'Box' },
        { id: 'connection', icon: Share2, label: 'Connect' },
        { id: 'text', icon: Type, label: 'Annotation' },
    ];

    const actions = [
        { id: 'undo', icon: Undo, label: 'Undo', action: undo },
        { id: 'redo', icon: Redo, label: 'Redo', action: redo },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-2 p-2 rounded-2xl bg-dark-surface/80 backdrop-blur-md border border-dark-border/50 shadow-xl-lift ring-1 ring-white/5"
            >
                {tools.map((tool) => (
                    <Tooltip key={tool.id} text={tool.label}>
                        <button
                            onClick={() => onToolSelect(tool.id)}
                            className={clsx(
                                "relative p-3 rounded-xl transition-all duration-200 group hover:bg-white/5",
                                activeTool === tool.id ? "bg-accent-blue/10 text-accent-blue" : "text-gray-400"
                            )}
                        >
                            <tool.icon className="w-5 h-5 relative z-10" />
                            {activeTool === tool.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-accent-blue/10 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    </Tooltip>
                ))}

                <div className="w-px h-6 bg-dark-border mx-1" />

                <Tooltip text={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </Tooltip>

                {actions.map((action) => (
                    <Tooltip key={action.id} text={action.label}>
                        <button
                            onClick={action.action}
                            className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <action.icon className="w-5 h-5" />
                        </button>
                    </Tooltip>
                ))}
            </motion.div>
        </div>
    );
};

const Tooltip = ({ text, children }: { text: string, children: React.ReactNode }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded-md whitespace-nowrap z-50 pointer-events-none"
                    >
                        {text}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
