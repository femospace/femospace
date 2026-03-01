import React, { useState, useRef } from 'react';
import { X, Upload, Film, Image as ImageIcon, Check, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

interface VideoUploadProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    defaultType?: 'reel' | 'video';
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
    isOpen,
    onClose,
    onSuccess,
    defaultType = 'video'
}) => {
    const [step, setStep] = useState<'select' | 'details' | 'uploading' | 'success'>('select');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [type, setType] = useState<'reel' | 'video'>(defaultType);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: '',
        category: 'entertainment',
        visibility: 'public'
    });

    const videoInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate video
        if (!file.type.startsWith('video/')) {
            alert('Please select a video file');
            return;
        }

        // Check size (max 500MB for videos, 100MB for reels)
        const maxSize = type === 'reel' ? 100 * 1024 * 1024 : 500 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
            return;
        }

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
        setStep('details');
    };

    const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!videoFile) return;

        setStep('uploading');

        try {
            // Upload video file
            const videoFormData = new FormData();
            videoFormData.append('file', videoFile);

            const { data: videoUpload } = await api.post('/chat/upload', videoFormData, {
                onUploadProgress: (progressEvent) => {
                    const progress = progressEvent.total
                        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        : 0;
                    setUploadProgress(progress * 0.7); // 70% for video upload
                }
            });

            // Upload thumbnail if provided
            let thumbnailUrl = '';
            if (thumbnailFile) {
                const thumbnailFormData = new FormData();
                thumbnailFormData.append('file', thumbnailFile);

                const { data: thumbnailUpload } = await api.post('/chat/upload', thumbnailFormData);
                thumbnailUrl = thumbnailUpload.url;
            }

            setUploadProgress(80);

            // Create video entry
            const videoData = {
                title: formData.title,
                description: formData.description,
                url: videoUpload.url,
                thumbnailUrl: thumbnailUrl || videoUpload.url,
                type: type,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                visibility: formData.visibility,
                category: formData.category
            };

            await api.post('/videos', videoData);

            // Also create a post for this video so it shows in the feed
            await api.post('/posts', {
                type: type === 'reel' ? 'reel' : 'video',
                content: formData.description || formData.title,
                visibility: formData.visibility,
                media: [{ url: videoUpload.url, type: 'video', thumbnailUrl: thumbnailUrl || videoUpload.url }],
                status: 'published'
            });

            setUploadProgress(100);
            setStep('success');

            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 2000);

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
            setStep('details');
        }
    };

    const handleClose = () => {
        setStep('select');
        setVideoFile(null);
        setThumbnailFile(null);
        setVideoPreview(null);
        setThumbnailPreview(null);
        setUploadProgress(0);
        setFormData({
            title: '',
            description: '',
            tags: '',
            category: 'entertainment',
            visibility: 'public'
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-neutral-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">
                                {step === 'select' && 'Upload Video'}
                                {step === 'details' && 'Video Details'}
                                {step === 'uploading' && 'Uploading...'}
                                {step === 'success' && 'Upload Complete!'}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-all text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Step 1: Select Video */}
                            {step === 'select' && (
                                <div className="space-y-4">
                                    {/* Type Selection */}
                                    <div className="flex gap-4 mb-6">
                                        <button
                                            onClick={() => setType('video')}
                                            className={`flex-1 p-6 rounded-xl border-2 transition-all ${type === 'video'
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <Film size={32} className="mx-auto mb-2 text-white" />
                                            <div className="text-white font-bold">Video</div>
                                            <div className="text-gray-400 text-sm">Up to 500MB</div>
                                        </button>
                                        <button
                                            onClick={() => setType('reel')}
                                            className={`flex-1 p-6 rounded-xl border-2 transition-all ${type === 'reel'
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <Film size={32} className="mx-auto mb-2 text-white" />
                                            <div className="text-white font-bold">Reel</div>
                                            <div className="text-gray-400 text-sm">Max 90 seconds</div>
                                        </button>
                                    </div>

                                    {/* Upload Area */}
                                    <div
                                        onClick={() => videoInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition-all"
                                    >
                                        <Upload size={48} className="mx-auto mb-4 text-white/60" />
                                        <p className="text-white font-semibold mb-2">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            MP4, WebM, or MOV (max {type === 'reel' ? '100MB' : '500MB'})
                                        </p>
                                    </div>

                                    <input
                                        ref={videoInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoSelect}
                                        className="hidden"
                                    />
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {step === 'details' && (
                                <div className="space-y-4">
                                    {/* Preview */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="text-white text-sm font-semibold mb-2 block">
                                                Video Preview
                                            </label>
                                            {videoPreview && (
                                                <video
                                                    src={videoPreview}
                                                    controls
                                                    className="w-full rounded-lg bg-black"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-white text-sm font-semibold mb-2 block">
                                                Thumbnail (Optional)
                                            </label>
                                            <div
                                                onClick={() => thumbnailInputRef.current?.click()}
                                                className="aspect-video border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-all flex items-center justify-center overflow-hidden"
                                            >
                                                {thumbnailPreview ? (
                                                    <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-center">
                                                        <ImageIcon size={32} className="mx-auto mb-2 text-white/40" />
                                                        <p className="text-white/60 text-xs">Click to upload</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailSelect}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                                            placeholder="Enter video title"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">
                                            Description
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500 resize-none"
                                            placeholder="Describe your video"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-white text-sm font-semibold mb-2 block">
                                                Category
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="entertainment">Entertainment</option>
                                                <option value="education">Education</option>
                                                <option value="music">Music</option>
                                                <option value="gaming">Gaming</option>
                                                <option value="sports">Sports</option>
                                                <option value="news">News</option>
                                                <option value="lifestyle">Lifestyle</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-white text-sm font-semibold mb-2 block">
                                                Visibility
                                            </label>
                                            <select
                                                value={formData.visibility}
                                                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="public">Public</option>
                                                <option value="unlisted">Unlisted</option>
                                                <option value="private">Private</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-white text-sm font-semibold mb-2 block">
                                            Tags (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
                                            placeholder="travel, vlog, adventure"
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={() => setStep('select')}
                                            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleUpload}
                                            disabled={!formData.title}
                                            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                                        >
                                            Upload
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Uploading */}
                            {step === 'uploading' && (
                                <div className="py-12 text-center">
                                    <Loader size={64} className="mx-auto mb-6 text-blue-500 animate-spin" />
                                    <h3 className="text-xl font-bold text-white mb-2">Uploading your video</h3>
                                    <p className="text-gray-400 mb-6">Please don't close this window</p>

                                    {/* Progress Bar */}
                                    <div className="max-w-md mx-auto">
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                className="h-full bg-blue-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${uploadProgress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <p className="text-white text-sm font-semibold">{uploadProgress}%</p>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Success */}
                            {step === 'success' && (
                                <div className="py-12 text-center">
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check size={48} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Upload Successful!</h3>
                                    <p className="text-gray-400">Your video is now being processed</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
