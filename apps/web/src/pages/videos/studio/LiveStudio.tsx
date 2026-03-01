import React, { useEffect } from 'react';
import { StudioProvider } from './StudioContext';
import { StudioHeader } from './components/Header';
import { SidebarLeft, SidebarRight } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Footer } from './components/Footer';
import { motion } from 'framer-motion';

export const LiveStudio: React.FC = () => {
    // Hide main layout navigation when in studio
    useEffect(() => {
        const mainNav = document.getElementById('main-nav');
        const mainHeader = document.getElementById('main-header');
        if (mainNav) mainNav.style.display = 'none';
        if (mainHeader) mainHeader.style.display = 'none';

        return () => {
            if (mainNav) mainNav.style.display = '';
            if (mainHeader) mainHeader.style.display = '';
        };
    }, []);

    return (
        <StudioProvider>
            <div className="fixed inset-0 bg-neutral-950 flex flex-col overflow-hidden z-[9999]">
                <StudioHeader />

                <div className="flex-1 flex overflow-hidden">
                    <SidebarLeft />

                    <div className="flex-1 flex flex-col overflow-hidden relative">
                        <Canvas />
                        <Footer />
                    </div>

                    <SidebarRight />
                </div>

                {/* Overlays / Modals can be added here */}
                <StudioBootOverlay />
            </div>
        </StudioProvider>
    );
};

const StudioBootOverlay: React.FC = () => {
    const [show, setShow] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center gap-6"
        >
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
                <h2 className="text-white font-black text-2xl uppercase tracking-widest">Femo Studio</h2>
                <p className="text-neutral-500 font-bold text-xs uppercase tracking-[0.3em] mt-2">Initializing Broadcast Engine</p>
            </div>
        </motion.div>
    );
};

export default LiveStudio;
