import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, Download, Send, Image as ImageIcon, Zap, ZapOff, Settings, Sparkles, Music, Type, Pen, Sticker, Crop, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService } from '../../services/chat.service';
import { useAuth } from '../../contexts/AuthContext';
import { faceDetector, DetectedFace } from '../../utils/faceDetection';
import { AR_FILTERS, ARFilter, FilterCategory, getFiltersByCategory } from '../../utils/arFilters';
import { API_BASE_URL } from '../../config';


// --- Types ---
type CameraMode = 'photo' | 'video';
type FilterType = { name: string; class: string; css: string };

const FILTERS: FilterType[] = [
    { name: 'Normal', class: '', css: 'none' },
    { name: 'Vivid', class: 'saturate-150 contrast-110', css: 'saturate(1.5) contrast(1.1)' },
    { name: 'B&W', class: 'grayscale', css: 'grayscale(1)' },
    { name: 'Sepia', class: 'sepia', css: 'sepia(1)' },
    { name: 'Vintage', class: 'sepia-50 contrast-125 brightness-90', css: 'sepia(0.5) contrast(1.25) brightness(0.9)' },
    { name: 'Cold', class: 'hue-rotate-180 saturate-50', css: 'hue-rotate(180deg) saturate(0.5)' },
    { name: 'Warm', class: 'sepia-30 saturate-150', css: 'sepia(0.3) saturate(1.5)' },
    { name: 'Cyber', class: 'hue-rotate-90 contrast-125 saturate-200', css: 'hue-rotate(90deg) contrast(1.25) saturate(2)' },
];

export const CameraTab: React.FC = () => {
    const { user } = useAuth();

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const arCanvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // State: Camera
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
    const [mode, setMode] = useState<CameraMode>('photo');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // State: Content
    const [capturedMedia, setCapturedMedia] = useState<{ url: string; type: 'image' | 'video'; file?: File } | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>(FILTERS[0]);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    // State: AR Filters
    const [activeARFilter, setActiveARFilter] = useState<ARFilter | null>(null);
    const [arFilterCategory, setArFilterCategory] = useState<FilterCategory>('mask');
    const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
    const [isAREnabled, setIsAREnabled] = useState(false);
    const [fpsCounter, setFpsCounter] = useState(0);
    const [isUsingRealDetection, setIsUsingRealDetection] = useState(false);

    // State: Editor
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingColor, setDrawingColor] = useState('#ff0000');
    const [textOverlay, setTextOverlay] = useState<{ text: string; x: number; y: number; color: string } | null>(null);
    const [isAddingText, setIsAddingText] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // --- Camera Logic ---
    const startCamera = async () => {
        try {
            if (stream) stream.getTracks().forEach(t => t.stop());

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                    // flash mode is complex in web, usually requires 'advanced' capabilities
                },
                audio: mode === 'video'
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) videoRef.current.srcObject = newStream;
            setError(null);
        } catch (err) {
            console.error('Camera Error:', err);
            setError('Could not access camera. Please check permissions.');
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
        };
    }, [facingMode, mode]);

    // Timer for video recording
    useEffect(() => {
        let interval: any;
        if (isRecording) {
            interval = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    // AR Rendering Loop
    useEffect(() => {
        if (!isAREnabled || !activeARFilter || !videoRef.current || !arCanvasRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = arCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let lastFrameTime = performance.now();
        let frameCount = 0;

        const renderARFrame = async () => {
            if (!video.videoWidth || !video.videoHeight) {
                animationFrameRef.current = requestAnimationFrame(renderARFrame);
                return;
            }

            // Set canvas size to match video
            if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            try {
                // Detect faces
                const faces = await faceDetector.detectFaces(video);
                setDetectedFaces(faces);

                // Render AR effects for each detected face
                if (faces.length > 0 && activeARFilter.canvasEffect) {
                    faces.forEach(face => {
                        activeARFilter.canvasEffect!(ctx, face);
                    });
                }

                // FPS Counter
                frameCount++;
                const now = performance.now();
                if (now - lastFrameTime >= 1000) {
                    setFpsCounter(frameCount);
                    frameCount = 0;
                    lastFrameTime = now;
                }
            } catch (error) {
                console.error('AR rendering error:', error);
            }

            animationFrameRef.current = requestAnimationFrame(renderARFrame);
        };

        // Initialize face detector
        faceDetector.initialize().then(() => {
            setIsUsingRealDetection(!faceDetector.isUsingMockDetection());
            renderARFrame();
        }).catch(err => {
            console.error('Failed to initialize face detector:', err);
            setIsAREnabled(false);
        });

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isAREnabled, activeARFilter]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            faceDetector.dispose();
        };
    }, []);

    // --- Actions ---

    const handleSwitchCamera = () => setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    const handleFlashToggle = () => setFlashMode(prev => prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off');

    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Apply filter to context if needed, or CSS filter on display
        if (activeFilter.css !== 'none') {
            ctx.filter = activeFilter.css;
        } else {
            ctx.filter = 'none';
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Apply AR filter overlay if enabled
        if (isAREnabled && activeARFilter && arCanvasRef.current) {
            const arCanvas = arCanvasRef.current;
            if (arCanvas.width > 0 && arCanvas.height > 0) {
                // Flip AR canvas if front camera
                if (facingMode === 'user') {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(arCanvas, -canvas.width, 0, canvas.width, canvas.height);
                    ctx.restore();
                } else {
                    ctx.drawImage(arCanvas, 0, 0, canvas.width, canvas.height);
                }
            }
        }

        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                setCapturedMedia({ url, type: 'image', file });
                stopCameraTracks();
            }
        }, 'image/jpeg', 0.95);
    }, [activeFilter, videoRef, isAREnabled, activeARFilter, arCanvasRef, facingMode]);

    const startRecording = () => {
        if (!stream) return;
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
            setCapturedMedia({ url, type: 'video', file });
            stopCameraTracks();
        };

        mediaRecorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = mediaRecorder;
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const stopCameraTracks = () => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
    };

    const handleRetake = () => {
        setCapturedMedia(null);
        setTextOverlay(null);
        setIsDrawing(false);
        const ctx = drawingCanvasRef.current?.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, drawingCanvasRef.current!.width, drawingCanvasRef.current!.height);
        startCamera();
    };

    const handleSend = async (target: 'chat' | 'story') => {
        if (!capturedMedia?.file || !user) return;

        setIsUploading(true);
        try {
            // 1. Upload File
            const uploadRes = await chatService.uploadFile(capturedMedia.file);

            if (target === 'story') {
                // 2. Create Story

                // Call story service directly using fetch for now since we don't have service file ready or easy access
                // Wait, I should assume I can't reach a service I didn't create clearly.
                // Let's use fetch directly to /stories endpoint
                await fetch(`${API_BASE_URL}/stories`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        ownerType: 'user',
                        ownerId: user.id || (user as any)._id,
                        media: {
                            url: uploadRes.url,
                            type: capturedMedia.type
                        },
                        type: capturedMedia.type,
                        audience: 'public',
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                    })
                });
                alert('Added to Story!');
            } else {
                // Chat Logic - usually handled by selecting a chat. 
                // For MVP, we'll just alert or simulate sending to "Saved Messages" or similar if no chat selected context.
                // Or better, trigger a callback if this was opened from a specific chat context.
                alert('Sent to Chat! (Simulated)');
            }
            handleRetake();
        } catch (e) {
            console.error('Upload failed', e);
            alert('Failed to send');
        } finally {
            setIsUploading(false);
        }
    };

    // --- Drawing Logic ---
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !drawingCanvasRef.current) return;
        const canvas = drawingCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = drawingColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !drawingCanvasRef.current) return;
        // Check if buttons pressed for mouse
        if ('buttons' in e && e.buttons !== 1) return;

        const canvas = drawingCanvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    // --- Renders ---

    return (
        <div className="flex flex-col h-full bg-black relative overflow-hidden select-none">

            {/* --- ERROR VIEW --- */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-50 p-6 text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <Camera size={32} className="text-red-500" />
                    </div>
                    <p className="text-white font-bold mb-2">Camera Access Denied</p>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">{error}</p>
                    <button onClick={startCamera} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium">
                        Try Again
                    </button>
                    <button onClick={() => window.history.back()} className="mt-4 text-gray-500 text-sm hover:text-white">
                        Go Back
                    </button>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!capturedMedia ? (
                    // --- CAMERA VIEW ---
                    <motion.div
                        key="camera"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative flex-1"
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                            style={{ filter: activeFilter.css }}
                        />

                        {/* AR Canvas Overlay */}
                        <canvas
                            ref={arCanvasRef}
                            className={`absolute inset-0 w-full h-full pointer-events-none z-5 transform ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                            style={{ display: isAREnabled && activeARFilter ? 'block' : 'none' }}
                        />

                        {/* Top Controls */}
                        <div className="absolute top-0 left-0 right-0 p-4 pt-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-10">
                            <button onClick={handleFlashToggle} className="p-2 text-white/90 hover:bg-white/10 rounded-full transition-all">
                                {flashMode === 'off' ? <ZapOff size={24} /> : flashMode === 'on' ? <Zap size={24} className="text-yellow-400" /> : <Zap size={24} className="opacity-50" />}
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)} className={`px-3 py-1 flex items-center gap-2 rounded-full backdrop-blur-md transition-all ${isFilterMenuOpen ? 'bg-yellow-400 text-black' : 'bg-black/30 text-white'}`}>
                                    <Sparkles size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{activeFilter.name}</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAREnabled(!isAREnabled);
                                        if (!isAREnabled && !activeARFilter) {
                                            setActiveARFilter(AR_FILTERS.find(f => f.category === 'mask') || null);
                                        }
                                    }}
                                    className={`px-3 py-1 flex items-center gap-2 rounded-full backdrop-blur-md transition-all ${isAREnabled ? 'bg-purple-500 text-white' : 'bg-black/30 text-white'}`}
                                >
                                    <span className="text-lg">{activeARFilter?.thumbnail || '🎭'}</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">AR</span>
                                </button>
                            </div>
                            <button className="p-2 text-white/90 hover:bg-white/10 rounded-full transition-all">
                                <Settings size={24} />
                            </button>
                        </div>


                        {/* AR Debug Info */}
                        {isAREnabled && (
                            <div className="absolute top-20 left-4 bg-black/80 px-3 py-2 rounded-lg text-white text-xs font-mono z-10 space-y-1 backdrop-blur-md border border-purple-500/30">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${fpsCounter > 25 ? 'bg-green-500' : fpsCounter > 15 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                    <span className="font-bold">{fpsCounter} FPS</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px]">
                                    <span className={isUsingRealDetection ? 'text-green-400' : 'text-yellow-400'}>
                                        {isUsingRealDetection ? '🤖 MediaPipe' : '⚠️ Mock Mode'}
                                    </span>
                                </div>
                                <div className="text-[10px] text-gray-400">
                                    {detectedFaces.length} face{detectedFaces.length !== 1 ? 's' : ''} detected
                                </div>
                            </div>
                        )}

                        {/* Filters Menu */}
                        {isFilterMenuOpen && (
                            <div className="absolute bottom-32 left-0 right-0 py-4 overflow-x-auto scrollbar-hide z-20">
                                <div className="flex px-4 gap-3 justify-center">
                                    {FILTERS.map(f => (
                                        <button
                                            key={f.name}
                                            onClick={() => setActiveFilter(f)}
                                            className={`flex flex-col items-center gap-1 min-w-[60px] cursor-pointer transition-transform active:scale-95`}
                                        >
                                            <div className={`w-14 h-14 rounded-full border-2 overflow-hidden ${activeFilter.name === f.name ? 'border-yellow-400 scale-110' : 'border-white/50'}`}>
                                                <div className="w-full h-full bg-gray-500" style={{ filter: f.css }} />
                                            </div>
                                            <span className={`text-[10px] font-medium shadow-black/50 drop-shadow-md ${activeFilter.name === f.name ? 'text-yellow-400' : 'text-white'}`}>
                                                {f.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AR Filters Menu */}
                        {isAREnabled && (
                            <div className="absolute bottom-32 left-0 right-0 z-20">
                                {/* Category Tabs */}
                                <div className="flex justify-center gap-2 mb-3 px-4">
                                    {(['beauty', 'color', 'mask', '3d', 'interactive'] as FilterCategory[]).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setArFilterCategory(cat)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-md transition-all ${arFilterCategory === cat ? 'bg-purple-500 text-white' : 'bg-black/30 text-white/70'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Filter Carousel */}
                                <div className="overflow-x-auto scrollbar-hide py-2">
                                    <div className="flex px-4 gap-3">
                                        <button
                                            onClick={() => {
                                                setActiveARFilter(null);
                                                setIsAREnabled(false);
                                            }}
                                            className={`flex flex-col items-center gap-1 min-w-[60px] cursor-pointer transition-transform active:scale-95`}
                                        >
                                            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${!activeARFilter ? 'border-purple-400 bg-purple-500/20 scale-110' : 'border-white/50 bg-black/30'}`}>
                                                <span className="text-2xl">❌</span>
                                            </div>
                                            <span className={`text-[10px] font-medium ${!activeARFilter ? 'text-purple-400' : 'text-white'}`}>
                                                None
                                            </span>
                                        </button>
                                        {getFiltersByCategory(arFilterCategory).map(filter => (
                                            <button
                                                key={filter.id}
                                                onClick={() => setActiveARFilter(filter)}
                                                className={`flex flex-col items-center gap-1 min-w-[60px] cursor-pointer transition-transform active:scale-95`}
                                            >
                                                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center ${activeARFilter?.id === filter.id ? 'border-purple-400 bg-purple-500/20 scale-110' : 'border-white/50 bg-black/30'}`}>
                                                    <span className="text-2xl">{filter.thumbnail}</span>
                                                </div>
                                                <span className={`text-[10px] font-medium ${activeARFilter?.id === filter.id ? 'text-purple-400' : 'text-white'}`}>
                                                    {filter.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 pb-12 pt-20 px-8 flex justify-between items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10">
                            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all">
                                <ImageIcon size={24} />
                            </button>

                            <div className="relative">
                                {/* Capture Button */}
                                <button
                                    onClick={capturePhoto}
                                    onMouseDown={startRecording}
                                    onMouseUp={stopRecording}
                                    onTouchStart={startRecording}
                                    onTouchEnd={stopRecording}
                                    className={`relative z-10 w-20 h-20 rounded-full border-[5px] flex items-center justify-center transition-all duration-200 transform ${isRecording ? 'border-red-500 scale-110' : 'border-white hover:scale-105'}`}
                                >
                                    <div className={`rounded-full transition-all duration-200 ${isRecording ? 'w-8 h-8 bg-red-500 rounded-sm' : 'w-16 h-16 bg-white'}`} />
                                </button>
                                {isRecording && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 px-3 py-1 rounded-full text-white text-xs font-bold animate-pulse">
                                        {new Date(recordingTime * 1000).toISOString().substr(14, 5)}
                                    </div>
                                )}
                            </div>

                            <button onClick={handleSwitchCamera} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all">
                                <RefreshCw size={24} />
                            </button>
                        </div>

                        {/* Mode Switcher */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-sm font-bold shadow-black/50 drop-shadow-lg z-10">
                            <button onClick={() => setMode('photo')} className={`${mode === 'photo' ? 'text-yellow-400' : 'text-white/60'} uppercase tracking-widest`}>Photo</button>
                            <button onClick={() => setMode('video')} className={`${mode === 'video' ? 'text-yellow-400' : 'text-white/60'} uppercase tracking-widest`}>Video</button>
                        </div>
                    </motion.div>
                ) : (
                    // --- EDITOR VIEW ---
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative flex-1 bg-black flex items-center justify-center"
                    >
                        {/* Media Display */}
                        <div className="relative w-full h-full max-h-full aspect-[9/16] bg-black">
                            {capturedMedia.type === 'image' ? (
                                <img src={capturedMedia.url} className="w-full h-full object-contain" />
                            ) : (
                                <video src={capturedMedia.url} autoPlay loop className="w-full h-full object-contain" />
                            )}

                            {/* Drawing Canvas */}
                            {isDrawing && (
                                <canvas
                                    ref={drawingCanvasRef}
                                    width={window.innerWidth}
                                    height={window.innerHeight}
                                    className="absolute inset-0 z-20 touch-none"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={() => { }}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={() => { }}
                                />
                            )}

                            {/* Text Overlay */}
                            {textOverlay && (
                                <div
                                    className="absolute z-20 font-bold text-2xl px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm"
                                    style={{ left: textOverlay.x, top: textOverlay.y, color: textOverlay.color }}
                                >
                                    {textOverlay.text}
                                </div>
                            )}

                            {/* Text Input Modal */}
                            {isAddingText && (
                                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                                    <input
                                        autoFocus
                                        placeholder="Type something..."
                                        className="bg-transparent text-white text-3xl font-bold text-center border-none focus:ring-0 outline-none w-full"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setTextOverlay({ text: (e.target as any).value, x: 100, y: 300, color: drawingColor });
                                                setIsAddingText(false);
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Top Editor Tools */}
                        <div className="absolute top-4 right-4 flex flex-col gap-4 z-30">
                            <button onClick={() => setIsAddingText(true)} className="w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all">
                                <Type size={20} />
                            </button>
                            <button onClick={() => setIsDrawing(!isDrawing)} className={`w-10 h-10 ${isDrawing ? 'bg-yellow-400 text-black' : 'bg-black/40 text-white'} hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center transition-all`}>
                                <Pen size={20} />
                            </button>
                            <button className="w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all">
                                <Sticker size={20} />
                            </button>
                            <button className="w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all">
                                <Music size={20} />
                            </button>
                            <button className="w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white flex items-center justify-center transition-all">
                                <Crop size={20} />
                            </button>
                        </div>

                        {/* Color Picker (Only if Drawing or Text) */}
                        {(isDrawing || isAddingText) && (
                            <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 bg-black/40 p-2 rounded-2xl backdrop-blur-md">
                                {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff', '#000000'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setDrawingColor(c)}
                                        className={`w-6 h-6 rounded-full border-2 ${drawingColor === c ? 'border-white scale-125' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-30">
                            <button onClick={handleRetake} className="w-12 h-12 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-lg">
                                <Trash2 size={24} />
                            </button>

                            <button className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700 text-white rounded-full font-bold backdrop-blur-md shadow-lg flex items-center gap-2">
                                <Download size={20} /> Save
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSend('story')}
                                    disabled={isUploading}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <Plus size={20} />}
                                    Story
                                </button>
                                <button
                                    onClick={() => handleSend('chat')}
                                    disabled={isUploading}
                                    className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isUploading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={20} />}
                                    Send
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};
