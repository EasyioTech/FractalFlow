import React, { useState } from 'react';
import { Keyboard, X, Command, Delete, MousePointer2, ZoomIn, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const KeymapGuide: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const shortcuts = [
        { icon: <Delete className="w-4 h-4" />, label: "Delete Node/Edge", keys: ["x", "Del"] },
        { icon: <Command className="w-4 h-4" />, label: "Undo Action", keys: ["Ctrl", "Z"] },
        { icon: <Command className="w-4 h-4" />, label: "Redo Action", keys: ["Ctrl", "Y"] },
        { icon: <ZoomIn className="w-4 h-4" />, label: "Zoom In/Out", keys: ["Scroll"] },
        { icon: <MousePointer2 className="w-4 h-4" />, label: "Context Menu", keys: ["Right Click"] },
        { icon: <Search className="w-4 h-4" />, label: "Command Palette", keys: ["Ctrl", "K"] },
        { icon: <Keyboard className="w-4 h-4" />, label: "Toggle This Guide", keys: ["?"] }
    ];

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '?' && !e.target?.matches('input, textarea')) {
                setIsOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-colors border ${isOpen
                    ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/50'
                    : 'bg-white dark:bg-dark-surface text-gray-500 dark:text-gray-400 border-gray-200 dark:border-dark-border hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                title="Keyboard Shortcuts (?)"
            >
                <Keyboard className="w-5 h-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-12 w-80 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-xl border border-gray-200 dark:border-dark-border rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Keyboard className="w-4 h-4 text-accent-blue" />
                                Keyboard Shortcuts
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-2">
                            {shortcuts.map((shortcut, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-400 group-hover:text-accent-blue transition-colors">
                                            {shortcut.icon}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                            {shortcut.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {shortcut.keys.map((key, kIndex) => (
                                            <kbd
                                                key={kIndex}
                                                className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 shadow-sm"
                                            >
                                                {key}
                                            </kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
