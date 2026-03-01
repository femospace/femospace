import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Hls from 'hls.js';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    videoId?: string; // For resume playback
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    loop?: boolean;
    muted?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    poster,
    autoPlay = false,
    videoId,
    onEnded,
    onTimeUpdate,
    loop = false,
    muted = false
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [quality, setQuality] = useState('auto');
    const [showSettings, setShowSettings] = useState(false);
    const [hasError, setHasError] = useState(false);

    const hlsRef = useRef<Hls | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const initPlayer = () => {
        const video = videoRef.current;
        if (!video) return;

        setHasError(false);
        setIsBuffering(true);

        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        if (src.endsWith('.m3u8')) {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hlsRef.current = hls;

                hls.on(Hls.Events.ERROR, (_, data) => {
                    if (data.fatal) {
                        setHasError(true);
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            }
        } else {
            video.src = src;
        }

        if (videoId) {
            const savedTime = localStorage.getItem(`video-resume-${videoId}`);
            if (savedTime) {
                video.currentTime = parseFloat(savedTime);
            }
        }
    };

    useEffect(() => {
        initPlayer();

        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            onTimeUpdate?.(video.currentTime, video.duration);

            if (videoId && video.currentTime > 0) {
                localStorage.setItem(`video-resume-${videoId}`, video.currentTime.toString());
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            setIsBuffering(false);
        };

        const handleWaiting = () => setIsBuffering(true);
        const handleCanPlay = () => setIsBuffering(false);
        const handleEnded = () => {
            setIsPlaying(false);
            if (videoId) localStorage.removeItem(`video-resume-${videoId}`);
            onEnded?.();
        };

        const handleError = () => {
            setHasError(true);
            setIsBuffering(false);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('error', handleError);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('error', handleError);
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [src, videoId, onTimeUpdate, onEnded]);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (value: number) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = value;
        setCurrentTime(value);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (value: number) => {
        if (!videoRef.current) return;
        videoRef.current.volume = value;
        setVolume(value);
        setIsMuted(value === 0);
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;

        if (!isFullscreen) {
            videoRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const skip = (seconds: number) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime += seconds;
    };

    const changePlaybackSpeed = (speed: number) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = speed;
        setPlaybackSpeed(speed);
        setShowSettings(false);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 3000);
    };

    return (
        <div
            className="relative w-full h-full bg-black group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-contain"
                onClick={togglePlay}
                autoPlay={autoPlay}
                loop={loop}
                muted={muted || isMuted}
                playsInline
            />

            {/* Buffering Indicator */}
            {isBuffering && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white" />
                </div>
            )}

            {/* Error Overlay */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                    <div className="bg-red-500/20 p-4 rounded-full mb-4">
                        <VolumeX size={48} className="text-red-500" />
                    </div>
                    <p className="text-white font-bold text-lg mb-2">Video failed to load</p>
                    <p className="text-gray-400 text-sm mb-6 text-center px-10">Check your internet connection or try again later.</p>
                    <button
                        onClick={initPlayer}
                        className="bg-white text-black px-8 py-2 rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Controls Overlay */}
            <AnimatePresence>
                {(showControls || !isPlaying) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between pointer-events-none"
                    >
                        {/* Top Controls */}
                        <div className="p-4 flex justify-between items-start pointer-events-auto">
                            <div className="text-white">
                                <span className="bg-black/50 px-2 py-1 rounded text-xs">
                                    {quality.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Center Play Button */}
                        <div className="flex items-center justify-center pointer-events-auto">
                            {!isPlaying && (
                                <button
                                    onClick={togglePlay}
                                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                                >
                                    <Play size={40} fill="white" />
                                </button>
                            )}
                        </div>

                        {/* Bottom Controls */}
                        <div className="p-4 space-y-2 pointer-events-auto">
                            {/* Progress Bar */}
                            <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-mono">
                                    {formatTime(currentTime)}
                                </span>
                                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden group/progress cursor-pointer">
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration}
                                        value={currentTime}
                                        onChange={(e) => handleSeek(parseFloat(e.target.value))}
                                        className="w-full h-full appearance-none bg-transparent cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, transparent ${(currentTime / duration) * 100}%, transparent 100%)`
                                        }}
                                    />
                                </div>
                                <span className="text-white text-xs font-mono">
                                    {formatTime(duration)}
                                </span>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
                                    >
                                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                    </button>

                                    {/* Skip Backward */}
                                    <button
                                        onClick={() => skip(-10)}
                                        className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
                                    >
                                        <SkipBack size={20} />
                                    </button>

                                    {/* Skip Forward */}
                                    <button
                                        onClick={() => skip(10)}
                                        className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
                                    >
                                        <SkipForward size={20} />
                                    </button>

                                    {/* Volume */}
                                    <div className="flex items-center gap-2 group/volume">
                                        <button
                                            onClick={toggleMute}
                                            className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
                                        >
                                            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>
                                        <input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={volume}
                                            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                            className="w-0 group-hover/volume:w-20 transition-all h-1 bg-white/30 rounded-full appearance-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 relative">
                                    {/* Settings */}
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
                                    >
                                        <Settings size={20} />
                                    </button>

                                    {/* Settings Menu */}
                                    {showSettings && (
                                        <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md rounded-lg p-2 min-w-[200px] border border-white/10 shadow-2xl overflow-hidden">
                                            <div className="flex border-b border-white/10 mb-2">
                                                <div className="px-4 py-2 text-white text-xs font-bold uppercase tracking-wider opacity-60">Settings</div>
                                            </div>

                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                                <div className="px-3 py-1 text-white text-xs font-bold mb-1">Quality</div>
                                                <button
                                                    onClick={() => {
                                                        if (hlsRef.current) hlsRef.current.currentLevel = -1;
                                                        setQuality('auto');
                                                    }}
                                                    className={`w-full text-left px-3 py-1.5 rounded text-white text-xs hover:bg-white/10 ${quality === 'auto' ? 'bg-blue-600' : ''}`}
                                                >
                                                    Auto
                                                </button>
                                                {hlsRef.current?.levels.map((level, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => {
                                                            if (hlsRef.current) hlsRef.current.currentLevel = index;
                                                            setQuality(`${level.height}p`);
                                                        }}
                                                        className={`w-full text-left px-3 py-1.5 rounded text-white text-xs hover:bg-white/10 ${quality === `${level.height}p` ? 'bg-blue-600' : ''}`}
                                                    >
                                                        {level.height}p
                                                    </button>
                                                ))}

                                                <div className="px-3 py-1 text-white text-xs font-bold mt-4 mb-1 border-t border-white/10 pt-4">Playback Speed</div>
                                                <div className="grid grid-cols-2 gap-1 px-1">
                                                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                                        <button
                                                            key={speed}
                                                            onClick={() => changePlaybackSpeed(speed)}
                                                            className={`text-center px-1 py-1.5 rounded text-white text-xs hover:bg-white/10 ${playbackSpeed === speed ? 'bg-blue-600 text-white' : ''}`}
                                                        >
                                                            {speed}x
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fullscreen */}
                                    <button
                                        onClick={toggleFullscreen}
                                        className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
                                    >
                                        <Maximize size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
