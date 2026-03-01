import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../../../lib/api';

export type SourceType = 'webcam' | 'screen' | 'image' | 'video' | 'audio' | 'browser' | 'text' | 'alert' | 'chat';

export interface StudioSource {
    id: string;
    type: SourceType;
    name: string;
    settings: any;
    transform: {
        x: number;
        y: number;
        width: number;
        height: number;
        zIndex: number;
        opacity: number;
        rotation: number;
    };
    isVisible: boolean;
    isLocked: boolean;
}

export interface StudioScene {
    id: string;
    name: string;
    sources: StudioSource[];
}

export interface StreamHealth {
    bitrate: number;
    fps: number;
    cpu: number;
    droppedFrames: number;
    status: 'good' | 'warning' | 'critical';
}

interface StudioContextType {
    scenes: StudioScene[];
    activeSceneId: string;
    isStreaming: boolean;
    isRecording: boolean;
    health: StreamHealth;
    viewerCount: number;
    sessionId: string | null;

    // Actions
    addScene: (name: string) => void;
    deleteScene: (id: string) => void;
    setActiveScene: (id: string) => void;
    addSource: (sceneId: string, type: SourceType, name: string) => void;
    updateSource: (sceneId: string, sourceId: string, updates: Partial<StudioSource>) => void;
    deleteSource: (sceneId: string, sourceId: string) => void;
    renameScene: (sceneId: string, newName: string) => void;
    saveChanges: () => Promise<void>;
    startStream: (title: string, visibility: string) => Promise<void>;
    stopStream: () => Promise<void>;
    toggleRecord: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [scenes, setScenes] = useState<StudioScene[]>([]);
    const [activeSceneId, setActiveSceneId] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [health, setHealth] = useState<StreamHealth>({
        bitrate: 0,
        fps: 60,
        cpu: 0,
        droppedFrames: 0,
        status: 'good'
    });

    // Initial load
    useEffect(() => {
        const loadStudioData = async () => {
            try {
                const { data } = await api.get('/videos/studio/scenes');
                const mappedScenes = data.map((s: any) => ({
                    id: s.id || s._id,
                    name: s.name,
                    sources: s.sources || []
                }));
                setScenes(mappedScenes);
                if (mappedScenes.length > 0) setActiveSceneId(mappedScenes[0].id);
            } catch (error) {
                console.error('Failed to load studio scenes:', error);
                const defaultId = uuidv4();
                setScenes([{ id: defaultId, name: 'Scene 1', sources: [] }]);
                setActiveSceneId(defaultId);
            }
        };
        loadStudioData();
    }, []);

    // Simulation for viewer count and health
    useEffect(() => {
        if (isStreaming) {
            const interval = setInterval(() => {
                setViewerCount(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
                setHealth(prev => ({
                    ...prev,
                    bitrate: 4500 + Math.floor(Math.random() * 500),
                    cpu: 20 + Math.floor(Math.random() * 10),
                    status: Math.random() > 0.05 ? 'good' : 'warning'
                }));
            }, 3000);
            return () => clearInterval(interval);
        } else {
            setViewerCount(0);
            setHealth({ bitrate: 0, fps: 60, cpu: 0, droppedFrames: 0, status: 'good' });
        }
    }, [isStreaming]);

    const addScene = (name: string) => {
        const newScene = { id: uuidv4(), name, sources: [] };
        setScenes([...scenes, newScene]);
    };

    const deleteScene = (id: string) => {
        if (scenes.length <= 1) return;
        setScenes(scenes.filter(s => s.id !== id));
        if (activeSceneId === id) {
            setActiveSceneId(scenes[0].id);
        }
    };

    const addSource = (sceneId: string, type: SourceType, name: string) => {
        const newSource: StudioSource = {
            id: uuidv4(),
            type,
            name,
            settings: {},
            transform: {
                x: 0,
                y: 0,
                width: 400,
                height: 300,
                zIndex: 1,
                opacity: 1,
                rotation: 0
            },
            isVisible: true,
            isLocked: false
        };

        setScenes(scenes.map(s => {
            if (s.id === sceneId) {
                return { ...s, sources: [...s.sources, newSource].sort((a, b) => a.transform.zIndex - b.transform.zIndex) };
            }
            return s;
        }));
    };

    const updateSource = useCallback((sceneId: string, sourceId: string, updates: Partial<StudioSource>) => {
        setScenes(prev => prev.map(s => {
            if (s.id === sceneId) {
                return {
                    ...s,
                    sources: s.sources.map(src =>
                        src.id === sourceId ? { ...src, ...updates } : src
                    ).sort((a, b) => (a.transform?.zIndex || 0) - (b.transform?.zIndex || 0))
                };
            }
            return s;
        }));
    }, []);

    const deleteSource = (sceneId: string, sourceId: string) => {
        setScenes(scenes.map(s => {
            if (s.id === sceneId) {
                return { ...s, sources: s.sources.filter(src => src.id !== sourceId) };
            }
            return s;
        }));
    };

    const renameScene = (sceneId: string, newName: string) => {
        setScenes(scenes.map(s => s.id === sceneId ? { ...s, name: newName } : s));
    };

    const saveChanges = async () => {
        try {
            await api.post('/videos/studio/scenes', scenes);
        } catch (error) {
            console.error('Failed to save scenes:', error);
            throw error;
        }
    };

    const startStream = async (title: string, visibility: string) => {
        try {
            await saveChanges();
            const { data } = await api.post('/videos/studio/session/start', {
                title,
                visibility,
                config: { layout: scenes }
            });
            setSessionId(data._id);
            setIsStreaming(true);
        } catch (error) {
            console.error('Failed to start stream:', error);
            throw error;
        }
    };

    const stopStream = async () => {
        if (!sessionId) return;
        try {
            await api.post(`/videos/studio/session/${sessionId}/end`);
            setIsStreaming(false);
            setSessionId(null);
        } catch (error) {
            console.error('Failed to stop stream:', error);
        }
    };

    const toggleRecord = () => {
        setIsRecording(!isRecording);
    };

    return (
        <StudioContext.Provider value={{
            scenes,
            activeSceneId,
            isStreaming,
            isRecording,
            health,
            viewerCount,
            sessionId,
            addScene,
            deleteScene,
            setActiveScene: setActiveSceneId,
            addSource,
            updateSource,
            deleteSource,
            renameScene,
            saveChanges,
            startStream,
            stopStream,
            toggleRecord
        }}>
            {children}
        </StudioContext.Provider>
    );
};

export const useStudio = () => {
    const context = useContext(StudioContext);
    if (!context) throw new Error('useStudio must be used within a StudioProvider');
    return context;
};
