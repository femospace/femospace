// AR Filter Definitions and Rendering Logic

import { DetectedFace } from './faceDetection';
export type FilterCategory = 'beauty' | 'color' | 'mask' | '3d' | 'interactive';


export interface ARFilter {
    id: string;
    name: string;
    category: FilterCategory;
    thumbnail: string;
    cssFilter?: string;
    canvasEffect?: (ctx: CanvasRenderingContext2D, face: DetectedFace) => void;

    webglShader?: string;
}

export const AR_FILTERS: ARFilter[] = [
    // Beauty Filters
    {
        id: 'beauty-smooth',
        name: 'Smooth',
        category: 'beauty',
        thumbnail: '✨',
        cssFilter: 'blur(0.5px) brightness(1.05) contrast(0.95)',
    },
    {
        id: 'beauty-glow',
        name: 'Glow',
        category: 'beauty',
        thumbnail: '💫',
        cssFilter: 'brightness(1.1) saturate(1.2) blur(0.3px)',
    },

    // Color Filters
    {
        id: 'color-warm',
        name: 'Warm',
        category: 'color',
        thumbnail: '🔥',
        cssFilter: 'sepia(0.3) saturate(1.4) brightness(1.05)',
    },
    {
        id: 'color-cool',
        name: 'Cool',
        category: 'color',
        thumbnail: '❄️',
        cssFilter: 'hue-rotate(180deg) saturate(0.7) brightness(1.1)',
    },
    {
        id: 'color-vintage',
        name: 'Vintage',
        category: 'color',
        thumbnail: '📷',
        cssFilter: 'sepia(0.5) contrast(1.2) brightness(0.9)',
    },
    {
        id: 'color-cinematic',
        name: 'Cinematic',
        category: 'color',
        thumbnail: '🎬',
        cssFilter: 'contrast(1.3) saturate(1.1) brightness(0.95)',
    },
    {
        id: 'color-bw',
        name: 'B&W',
        category: 'color',
        thumbnail: '⚫',
        cssFilter: 'grayscale(1) contrast(1.2)',
    },
    {
        id: 'color-neon',
        name: 'Neon',
        category: 'color',
        thumbnail: '🌈',
        cssFilter: 'hue-rotate(90deg) saturate(2) contrast(1.5)',
    },

    // AR Mask Filters
    {
        id: 'mask-glasses',
        name: 'Glasses',
        category: 'mask',
        thumbnail: '🕶️',
        canvasEffect: (ctx, face) => {
            if (!face?.keypoints) return;
            const { leftEye, rightEye } = face.keypoints;
            const eyeDistance = Math.abs(rightEye.x - leftEye.x);

            // Draw glasses
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(leftEye.x, leftEye.y, eyeDistance * 0.25, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(rightEye.x, rightEye.y, eyeDistance * 0.25, 0, Math.PI * 2);
            ctx.stroke();
            // Bridge
            ctx.beginPath();
            ctx.moveTo(leftEye.x + eyeDistance * 0.25, leftEye.y);
            ctx.lineTo(rightEye.x - eyeDistance * 0.25, rightEye.y);
            ctx.stroke();
        }
    },
    {
        id: 'mask-dog',
        name: 'Dog',
        category: 'mask',
        thumbnail: '🐶',
        canvasEffect: (ctx, face) => {
            if (!face?.keypoints) return;
            const { nose, leftEar, rightEar } = face.keypoints;

            // Draw dog nose
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(nose.x, nose.y, 15, 0, Math.PI * 2);
            ctx.fill();

            // Draw dog ears
            ctx.fillStyle = '#8B4513';
            ctx.beginPath();
            ctx.ellipse(leftEar.x, leftEar.y - 30, 25, 40, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(rightEar.x, rightEar.y - 30, 25, 40, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    {
        id: 'mask-cat',
        name: 'Cat',
        category: 'mask',
        thumbnail: '🐱',
        canvasEffect: (ctx, face) => {
            if (!face?.keypoints) return;
            const { nose, leftEar, rightEar } = face.keypoints;

            // Cat nose
            ctx.fillStyle = '#FFB6C1';
            ctx.beginPath();
            ctx.moveTo(nose.x, nose.y - 5);
            ctx.lineTo(nose.x - 8, nose.y + 5);
            ctx.lineTo(nose.x + 8, nose.y + 5);
            ctx.closePath();
            ctx.fill();

            // Cat ears
            ctx.fillStyle = '#FFB6C1';
            ctx.strokeStyle = '#FF69B4';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(leftEar.x, leftEar.y);
            ctx.lineTo(leftEar.x - 20, leftEar.y - 50);
            ctx.lineTo(leftEar.x + 10, leftEar.y - 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(rightEar.x, rightEar.y);
            ctx.lineTo(rightEar.x + 20, rightEar.y - 50);
            ctx.lineTo(rightEar.x - 10, rightEar.y - 20);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Whiskers
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const offset = (i - 1) * 10;
                ctx.beginPath();
                ctx.moveTo(nose.x - 10, nose.y + offset);
                ctx.lineTo(nose.x - 50, nose.y + offset - 5);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(nose.x + 10, nose.y + offset);
                ctx.lineTo(nose.x + 50, nose.y + offset - 5);
                ctx.stroke();
            }
        }
    },
    {
        id: 'mask-crown',
        name: 'Crown',
        category: '3d',
        thumbnail: '👑',
        canvasEffect: (ctx, face) => {
            if (!face?.boundingBox) return;
            const { xMin, yMin, width } = face.boundingBox;
            const centerX = xMin + width / 2;
            const topY = yMin - 40;

            // Draw crown
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(centerX - 40, topY + 30);
            ctx.lineTo(centerX - 30, topY);
            ctx.lineTo(centerX - 20, topY + 20);
            ctx.lineTo(centerX, topY - 5);
            ctx.lineTo(centerX + 20, topY + 20);
            ctx.lineTo(centerX + 30, topY);
            ctx.lineTo(centerX + 40, topY + 30);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Add jewels
            ctx.fillStyle = '#FF0000';
            [centerX - 30, centerX, centerX + 30].forEach(x => {
                ctx.beginPath();
                ctx.arc(x, topY + 10, 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    },
    {
        id: 'mask-heart',
        name: 'Hearts',
        category: '3d',
        thumbnail: '💕',
        canvasEffect: (ctx, face) => {
            if (!face?.keypoints) return;
            const { leftEye, rightEye } = face.keypoints;

            const drawHeart = (x: number, y: number, size: number) => {
                ctx.fillStyle = '#FF69B4';
                ctx.beginPath();
                ctx.moveTo(x, y + size * 0.3);
                ctx.bezierCurveTo(x, y, x - size * 0.5, y - size * 0.5, x - size * 0.5, y + size * 0.3);
                ctx.bezierCurveTo(x - size * 0.5, y + size, x, y + size * 1.3, x, y + size * 1.7);
                ctx.bezierCurveTo(x, y + size * 1.3, x + size * 0.5, y + size, x + size * 0.5, y + size * 0.3);
                ctx.bezierCurveTo(x + size * 0.5, y - size * 0.5, x, y, x, y + size * 0.3);
                ctx.fill();
            };

            drawHeart(leftEye.x, leftEye.y - 30, 15);
            drawHeart(rightEye.x, rightEye.y - 30, 15);
        }
    },

    // Interactive Filters
    {
        id: 'interactive-sparkle',
        name: 'Sparkle',
        category: 'interactive',
        thumbnail: '✨',
        canvasEffect: (ctx, face) => {
            if (!face?.boundingBox) return;
            const { xMin, yMin, width, height } = face.boundingBox;

            // Random sparkles around face
            ctx.fillStyle = '#FFD700';
            for (let i = 0; i < 10; i++) {
                const x = xMin + Math.random() * width;
                const y = yMin + Math.random() * height;
                const size = Math.random() * 3 + 1;

                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();

                // Star shape
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(Math.random() * Math.PI);
                ctx.fillRect(-size * 2, -size * 0.5, size * 4, size);
                ctx.fillRect(-size * 0.5, -size * 2, size, size * 4);
                ctx.restore();
            }
        }
    }
];

export const getFiltersByCategory = (category: FilterCategory) => {
    return AR_FILTERS.filter(f => f.category === category);
};

export const getFilterById = (id: string) => {
    return AR_FILTERS.find(f => f.id === id);
};
