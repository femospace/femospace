import React, { useRef, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useStudio, StudioSource } from '../StudioContext';

export const Canvas: React.FC = () => {
    const { scenes, activeSceneId, updateSource } = useStudio();
    const activeScene = scenes.find(s => s.id === activeSceneId);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Maintain 16:9 aspect ratio and scale sources accordingly
    useEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setScale(width / 1920); // Base resolution 1920x1080
            }
        };

        window.addEventListener('resize', updateScale);
        updateScale();
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    if (!activeScene) return null;

    return (
        <div className="flex-1 bg-neutral-950 flex items-center justify-center p-8 overflow-hidden">
            <div
                ref={containerRef}
                className="relative bg-black shadow-2xl overflow-hidden aspect-video w-full max-w-[1280px]"
                style={{ height: 'auto' }}
            >
                {/* Visual Guides */}
                <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-px h-full bg-white/5" />
                    <div className="h-px w-full bg-white/5" />
                </div>

                {activeScene.sources.filter(s => s.isVisible).map((source) => (
                    <Rnd
                        key={source.id}
                        size={{
                            width: source.transform.width * scale,
                            height: source.transform.height * scale
                        }}
                        position={{
                            x: source.transform.x * scale,
                            y: source.transform.y * scale
                        }}
                        onDragStop={(_, d) => {
                            updateSource(activeSceneId, source.id, {
                                transform: { ...source.transform, x: d.x / scale, y: d.y / scale }
                            });
                        }}
                        onResizeStop={(_, __, ref, ___, position) => {
                            updateSource(activeSceneId, source.id, {
                                transform: {
                                    ...source.transform,
                                    width: parseFloat(ref.style.width) / scale,
                                    height: parseFloat(ref.style.height) / scale,
                                    ...position
                                }
                            });
                        }}
                        disableDragging={source.isLocked}
                        enableResizing={!source.isLocked}
                        bounds="parent"
                        className={`border-2 transition-colors ${source.isLocked ? 'border-transparent' : 'border-blue-500/50 hover:border-blue-500'}`}
                        style={{ zIndex: source.transform.zIndex }}
                    >
                        <SourceRenderer source={source} />
                    </Rnd>
                ))}
            </div>
        </div>
    );
};

const SourceRenderer: React.FC<{ source: StudioSource }> = ({ source }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let currentStream: MediaStream | null = null;

        if (source.type === 'webcam') {
            const initCamera = async () => {
                try {
                    currentStream = await navigator.mediaDevices.getUserMedia({
                        video: { width: 1280, height: 720 },
                        audio: false
                    });
                    if (videoRef.current) {
                        videoRef.current.srcObject = currentStream;
                    }
                } catch (error) {
                    console.error('Failed to get webcam:', error);
                }
            };
            initCamera();
        }

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [source.type]);

    switch (source.type) {
        case 'webcam':
            return (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center relative overflow-hidden rounded">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover scale-x-[-1]"
                        autoPlay
                        muted
                        playsInline
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black text-white shadow-lg">CAMERA</div>
                </div>
            );
        case 'text':
            return (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl whitespace-nowrap overflow-hidden drop-shadow-lg">
                    {source.settings.text || 'Femo Space Studio'}
                </div>
            );
        case 'image':
            return (
                <img
                    src={source.settings.url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'}
                    className="w-full h-full object-cover rounded shadow-2xl"
                    alt={source.name}
                />
            );
        case 'chat':
            return (
                <div className="w-full h-full bg-black/40 backdrop-blur-md p-4 flex flex-col gap-2 overflow-hidden border border-white/10 rounded-xl text-left">
                    <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-1">LIVE CHAT</div>
                    <div className="space-y-2 overflow-y-auto pr-2">
                        <div className="text-[11px]"><span className="font-bold text-yellow-400">User:</span> <span className="text-white/80 ml-1">Hello space! ✨</span></div>
                        <div className="text-[11px]"><span className="font-bold text-blue-400">Mod:</span> <span className="text-white/80 ml-1">Welcome back! 🚀</span></div>
                    </div>
                </div>
            );
        default:
            return (
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/20 select-none border border-white/5 rounded">
                    {source.name}
                </div>
            );
    }
};
