import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CustomNodeWrapperProps {
    children: React.ReactNode;
    selected?: boolean;
    dragging?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
}

export const CustomNodeWrapper: React.FC<CustomNodeWrapperProps> = ({
    children,
    selected,
    dragging,
    className,
    style,
    onClick,
    onMouseEnter,
    onMouseLeave,
}) => {
    return (
        <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                duration: 0.3,
                ease: "easeOut"
            }}
            whileHover={{ scale: 1.02 }}
            className={clsx(
                "relative group",
                className
            )}
            style={style}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <motion.div
                animate={{
                    boxShadow: dragging
                        ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                        : selected
                            ? "0 0 0 1.5px #3B82F6, 0 4px 6px -1px rgba(0, 0, 0, 0.3)"
                            : "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.15)", // Very subtle default shadow
                    scale: dragging ? 1.05 : 1,
                    zIndex: dragging ? 50 : 1,
                }}
                transition={{ duration: 0.1 }}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
