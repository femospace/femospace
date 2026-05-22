export const DESIGN_SYSTEM = {
    colors: {
        primary: '#3b82f6', // blue-500
        secondary: '#6366f1', // indigo-500
        accent: '#f59e0b', // amber-500
        background: '#0f172a', // slate-900
        card: '#1e293b', // slate-800 or rgba(255,255,255,0.02)
        text: '#f8fafc', // slate-50
        textMuted: '#94a3b8', // slate-400
        success: '#10b981', // emerald-500
        danger: '#ef4444', // red-500
        glass: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.1)',
    },
    animations: {
        duration: {
            fast: 200,
            normal: 400,
            slow: 800,
        },
        spring: {
            stiffness: 100,
            damping: 10,
        },
    },
    typography: {
        fonts: {
            primary: 'Inter, sans-serif',
            mono: 'Monaco, monospace',
        },
    },
};
