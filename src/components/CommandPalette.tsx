import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import {
    Search, Plus, Trash2, Copy, Group,
    Maximize, ZoomIn, ZoomOut, Save,
    ArrowLeft, Layers, Eye, Moon,
    Undo2, Redo2, FileJson, Image, Upload,
    Keyboard, Target, XCircle, Grid3x3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactFlow } from 'reactflow';
import clsx from 'clsx';

interface CommandPaletteProps {
    onAction: (action: string, data?: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onAction }) => {
    const [open, setOpen] = useState(false);
    const { getNodes, getEdges } = useReactFlow();

    // Get selection state
    const selectedNodes = getNodes().filter(n => n.selected);
    const selectedEdges = getEdges().filter(e => e.selected);
    const hasSelection = selectedNodes.length > 0 || selectedEdges.length > 0;

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }

            // Global shortcuts (work even when palette is closed)
            if (!open) {
                if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    onAction('save');
                }
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [open, onAction]);

    const executeCommand = (action: string, data?: any) => {
        onAction(action, data);
        setOpen(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Command className="w-full">
                            <div className="flex items-center border-b border-zinc-700 px-4" cmdk-input-wrapper="">
                                <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
                                <Command.Input
                                    className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Type a command or search..."
                                />
                                <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                                    ESC
                                </kbd>
                            </div>
                            <Command.List className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
                                <Command.Empty className="py-6 text-center text-sm text-gray-500">No results found.</Command.Empty>

                                {/* Node Operations */}
                                <Command.Group heading="Node Operations" className="text-xs font-semibold text-gray-500 mb-1 px-2">
                                    <CommandItem
                                        icon={<Plus />}
                                        label="Add Node"
                                        shortcut="⌘N"
                                        onSelect={() => executeCommand('add-node')}
                                    />
                                    <CommandItem
                                        icon={<Copy />}
                                        label="Duplicate Selected"
                                        shortcut="⌘D"
                                        onSelect={() => executeCommand('duplicate')}
                                        disabled={!hasSelection}
                                    />
                                    <CommandItem
                                        icon={<Group />}
                                        label="Group Selected Nodes"
                                        onSelect={() => executeCommand('group-selection')}
                                        disabled={selectedNodes.length < 2}
                                    />
                                    <CommandItem
                                        icon={<Trash2 />}
                                        label="Delete Selected"
                                        shortcut="⌫"
                                        onSelect={() => executeCommand('delete-selection')}
                                        disabled={!hasSelection}
                                        danger
                                    />
                                </Command.Group>

                                {/* Navigation */}
                                <Command.Group heading="Navigation" className="text-xs font-semibold text-gray-500 mb-1 px-2 mt-3">
                                    <CommandItem
                                        icon={<ArrowLeft />}
                                        label="Navigate Back"
                                        shortcut="⌘←"
                                        onSelect={() => executeCommand('navigate-back')}
                                    />
                                    <CommandItem
                                        icon={<Layers />}
                                        label="View All Graphs"
                                        onSelect={() => executeCommand('view-graphs')}
                                    />
                                    <CommandItem
                                        icon={<XCircle />}
                                        label="Clear Canvas"
                                        onSelect={() => executeCommand('clear-canvas')}
                                        danger
                                    />
                                </Command.Group>

                                {/* View Controls */}
                                <Command.Group heading="View" className="text-xs font-semibold text-gray-500 mb-1 px-2 mt-3">
                                    <CommandItem
                                        icon={<Maximize />}
                                        label="Fit View"
                                        shortcut="⌘0"
                                        onSelect={() => executeCommand('fit-view')}
                                    />
                                    <CommandItem
                                        icon={<ZoomIn />}
                                        label="Zoom In"
                                        shortcut="⌘+"
                                        onSelect={() => executeCommand('zoom-in')}
                                    />
                                    <CommandItem
                                        icon={<ZoomOut />}
                                        label="Zoom Out"
                                        shortcut="⌘-"
                                        onSelect={() => executeCommand('zoom-out')}
                                    />
                                    <CommandItem
                                        icon={<Eye />}
                                        label="Toggle View Lock"
                                        shortcut="⌘L"
                                        onSelect={() => executeCommand('toggle-lock')}
                                    />
                                    <CommandItem
                                        icon={<Grid3x3 />}
                                        label="Toggle Grid"
                                        onSelect={() => executeCommand('toggle-grid')}
                                    />
                                    <CommandItem
                                        icon={<Moon />}
                                        label="Toggle Dark Mode"
                                        shortcut="⌘T"
                                        onSelect={() => executeCommand('toggle-theme')}
                                    />
                                </Command.Group>

                                {/* Edit */}
                                <Command.Group heading="Edit" className="text-xs font-semibold text-gray-500 mb-1 px-2 mt-3">
                                    <CommandItem
                                        icon={<Undo2 />}
                                        label="Undo"
                                        shortcut="⌘Z"
                                        onSelect={() => executeCommand('undo')}
                                    />
                                    <CommandItem
                                        icon={<Redo2 />}
                                        label="Redo"
                                        shortcut="⌘⇧Z"
                                        onSelect={() => executeCommand('redo')}
                                    />
                                    <CommandItem
                                        icon={<Target />}
                                        label="Select All"
                                        shortcut="⌘A"
                                        onSelect={() => executeCommand('select-all')}
                                    />
                                </Command.Group>

                                {/* File Operations */}
                                <Command.Group heading="File" className="text-xs font-semibold text-gray-500 mb-1 px-2 mt-3">
                                    <CommandItem
                                        icon={<Save />}
                                        label="Save Project"
                                        shortcut="⌘S"
                                        onSelect={() => executeCommand('save')}
                                    />
                                    <CommandItem
                                        icon={<FileJson />}
                                        label="Export as JSON"
                                        shortcut="⌘E"
                                        onSelect={() => executeCommand('export-json')}
                                    />
                                    <CommandItem
                                        icon={<Image />}
                                        label="Export as PNG"
                                        onSelect={() => executeCommand('export-png')}
                                    />
                                    <CommandItem
                                        icon={<Upload />}
                                        label="Import Architecture"
                                        onSelect={() => executeCommand('import')}
                                    />
                                </Command.Group>

                                {/* Help */}
                                <Command.Group heading="Help" className="text-xs font-semibold text-gray-500 mb-1 px-2 mt-3">
                                    <CommandItem
                                        icon={<Keyboard />}
                                        label="Show Keyboard Shortcuts"
                                        shortcut="?"
                                        onSelect={() => executeCommand('show-shortcuts')}
                                    />
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Helper component for command items
interface CommandItemProps {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    description?: string;
    onSelect: () => void;
    disabled?: boolean;
    danger?: boolean;
}

const CommandItem: React.FC<CommandItemProps> = ({
    icon,
    label,
    shortcut,
    description,
    onSelect,
    disabled = false,
    danger = false
}) => {
    return (
        <Command.Item
            onSelect={onSelect}
            disabled={disabled}
            className={clsx(
                "relative flex cursor-pointer select-none items-center rounded-md px-3 py-2.5 text-sm outline-none transition-colors",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
                danger
                    ? "aria-selected:bg-red-500/10 aria-selected:text-red-400 text-gray-300 hover:bg-red-500/5"
                    : "aria-selected:bg-accent-blue/10 aria-selected:text-accent-blue text-gray-300 hover:bg-zinc-800"
            )}
        >
            <div className={clsx("mr-3 h-4 w-4 shrink-0", danger && "text-red-400")}>
                {icon}
            </div>
            <div className="flex-1">
                <div className="font-medium">{label}</div>
                {description && (
                    <div className="text-xs text-gray-500 mt-0.5">{description}</div>
                )}
            </div>
            {shortcut && (
                <kbd className="ml-auto hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-gray-400">
                    {shortcut}
                </kbd>
            )}
        </Command.Item>
    );
};
