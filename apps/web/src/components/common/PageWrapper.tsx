import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import clsx from 'clsx';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children, className, animate = true }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={clsx(
            "min-h-screen relative overflow-hidden transition-colors duration-500",
            isDark ? "bg-[#0f172a]" : "bg-[#f8fafc]",
            className
        )}>
            {/* Animated Background Elements */}
            {animate && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, 30, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className={clsx(
                            "absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20",
                            isDark ? "bg-blue-600/30" : "bg-blue-400/30"
                        )}
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, -40, 0],
                            y: [0, 60, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className={clsx(
                            "absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-20",
                            isDark ? "bg-purple-600/30" : "bg-purple-400/30"
                        )}
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            x: [0, 30, 0],
                            y: [0, -40, 0],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className={clsx(
                            "absolute bottom-[10%] left-[10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10",
                            isDark ? "bg-indigo-600/20" : "bg-indigo-400/20"
                        )}
                    />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
