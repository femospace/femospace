# MediaPipe Face Mesh Integration - Testing Guide

## ✅ Installation Complete

MediaPipe Face Mesh has been successfully installed and integrated into the Femo Space AR Filters system.

## 🎯 What's New

### Real Face Detection
- **MediaPipe Face Mesh** - Google's production-grade face tracking
- **468 facial landmarks** - High-precision face mapping
- **Multi-face support** - Track up to 3 faces simultaneously
- **Real-time performance** - 30-60 FPS on modern devices
- **Automatic fallback** - Gracefully falls back to mock detection if MediaPipe fails to load

### Enhanced Debug Panel
The AR debug panel now shows:
- **FPS Counter** with color-coded performance indicator:
  - 🟢 Green: >25 FPS (Excellent)
  - 🟡 Yellow: 15-25 FPS (Good)
  - 🔴 Red: <15 FPS (Poor)
- **Detection Mode**:
  - 🤖 MediaPipe: Real face tracking active
  - ⚠️ Mock Mode: Fallback detection (for demo/testing)
- **Face Count**: Number of faces currently detected

## 🧪 Testing Instructions

### 1. Start the Application

```bash
# Make sure the web app is running
cd web-app
npm run dev
```

### 2. Navigate to Camera Tab

1. Open browser: `http://localhost:5173/chat`
2. Click the **Camera** tab (yellow icon)
3. Allow camera permissions when prompted

### 3. Activate AR Filters

1. Click the **AR** button (purple, top-right)
2. Watch the debug panel appear in the top-left
3. Check if it shows "🤖 MediaPipe" or "⚠️ Mock Mode"

### 4. Test Face Detection

**Expected Behavior:**
- Debug panel shows "🤖 MediaPipe" (real detection)
- FPS counter shows 30+ FPS (green indicator)
- Face count updates as you move in/out of frame
- AR filters track your face smoothly

**If Mock Mode:**
- Debug panel shows "⚠️ Mock Mode"
- Filters still work but use center-screen positioning
- Check browser console for MediaPipe load errors

### 5. Test AR Filters

Try each filter category:

**Mask Filters** (Best for testing face tracking):
- 🕶️ **Glasses** - Should align with your eyes
- 🐶 **Dog** - Nose and ears should track face position
- 🐱 **Cat** - Whiskers and ears should follow face
- 👑 **Crown** - Should stay on top of head
- 💕 **Hearts** - Should float above eyes

**Beauty Filters**:
- ✨ **Smooth** - Subtle blur effect
- 💫 **Glow** - Enhanced brightness

**Color Filters**:
- 🔥 **Warm**, ❄️ **Cool**, 📷 **Vintage**, etc.

**Interactive**:
- ✨ **Sparkle** - Particles around face

### 6. Test Photo Capture

1. Select an AR filter
2. Click the capture button (big white circle)
3. Verify AR filter is rendered in the captured photo
4. Check that filter alignment is correct

### 7. Performance Testing

**Good Performance Indicators:**
- FPS: 30-60 (green)
- Smooth filter tracking
- No lag when moving face
- Quick filter switching

**Poor Performance Indicators:**
- FPS: <15 (red/yellow)
- Choppy filter movement
- Delayed face detection
- Browser console errors

## 🔍 Troubleshooting

### MediaPipe Not Loading (Mock Mode Active)

**Possible Causes:**
1. **CDN blocked** - Check if `cdn.jsdelivr.net` is accessible
2. **CORS issues** - Check browser console for CORS errors
3. **Browser compatibility** - Ensure using Chrome 90+, Firefox 88+, or Safari 14.1+

**Solutions:**
```javascript
// Option 1: Self-host MediaPipe files
// Download from: https://github.com/google/mediapipe
// Place in: public/mediapipe/
// Update locateFile in faceDetection.ts:
locateFile: (file) => `/mediapipe/${file}`

// Option 2: Use different CDN
locateFile: (file) => `https://unpkg.com/@mediapipe/face_mesh/${file}`
```

### Low FPS (<20)

**Causes:**
- Weak GPU
- High camera resolution
- Multiple filters active
- Browser throttling

**Solutions:**
1. Close other browser tabs
2. Disable hardware acceleration in browser (ironically can help)
3. Lower camera resolution in `startCamera()`:
```typescript
width: { ideal: 1280 },  // Instead of 1920
height: { ideal: 720 }   // Instead of 1080
```

### Face Not Detected

**Causes:**
- Poor lighting
- Face too far/close
- Camera angle too extreme
- Glasses/mask obscuring face

**Solutions:**
- Ensure good frontal lighting
- Position face 1-2 feet from camera
- Face camera directly
- Remove obstructions if possible

### Filters Misaligned

**Causes:**
- Camera calibration
- Front/back camera flip
- Landmark mapping incorrect

**Solutions:**
- Check `facingMode` state
- Verify canvas flip logic in `capturePhoto()`
- Adjust landmark indices in `arFilters.ts`

## 📊 Performance Benchmarks

### Expected Performance

| Device Type | FPS | Detection | Quality |
|------------|-----|-----------|---------|
| Desktop (Modern) | 50-60 | MediaPipe | Excellent |
| Laptop (2020+) | 30-50 | MediaPipe | Good |
| Mobile (High-end) | 25-35 | MediaPipe | Good |
| Mobile (Mid-range) | 15-25 | MediaPipe | Fair |
| Old Devices | 10-15 | Mock | Demo Only |

### Optimization Tips

1. **Reduce maxNumFaces** if only need single face:
```typescript
this.faceMesh.setOptions({
    maxNumFaces: 1,  // Instead of 3
    // ...
});
```

2. **Disable landmark refinement** for speed:
```typescript
refineLandmarks: false,  // Faster but less accurate
```

3. **Increase confidence thresholds**:
```typescript
minDetectionConfidence: 0.7,  // Higher = faster but may miss faces
minTrackingConfidence: 0.7,
```

## 🎨 Adding Custom Filters

### Example: Custom Mask Filter

```typescript
// In arFilters.ts
{
    id: 'mask-bunny',
    name: 'Bunny',
    category: 'mask',
    thumbnail: '🐰',
    canvasEffect: (ctx, face) => {
        if (!face?.keypoints) return;
        const { nose, leftEar, rightEar } = face.keypoints;
        
        // Draw bunny nose
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(nose.x, nose.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bunny ears
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FFB6C1';
        ctx.lineWidth = 2;
        
        // Left ear
        ctx.beginPath();
        ctx.ellipse(leftEar.x, leftEar.y - 60, 20, 50, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Right ear
        ctx.beginPath();
        ctx.ellipse(rightEar.x, rightEar.y - 60, 20, 50, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}
```

## 🚀 Production Deployment

### Before Going Live

1. **Test on multiple devices**:
   - Desktop: Chrome, Firefox, Safari, Edge
   - Mobile: iOS Safari, Android Chrome
   - Tablets: iPad, Android tablets

2. **Performance profiling**:
   - Use Chrome DevTools Performance tab
   - Monitor memory usage
   - Check for memory leaks

3. **Error tracking**:
   - Integrate Sentry or similar
   - Log MediaPipe initialization failures
   - Track FPS drops

4. **CDN considerations**:
   - Consider self-hosting MediaPipe files
   - Use CDN with good global coverage
   - Implement retry logic for CDN failures

5. **User experience**:
   - Show loading indicator during initialization
   - Provide clear error messages
   - Offer "Skip AR" option for unsupported devices

## 📝 Known Limitations

1. **Browser Support**: Requires modern browsers with WebGL support
2. **Performance**: May struggle on devices >3 years old
3. **Lighting**: Requires adequate lighting for accurate detection
4. **Occlusion**: Masks, glasses, or hands may interfere with detection
5. **CDN Dependency**: Requires internet connection for first load

## 🎓 Resources

- [MediaPipe Face Mesh Docs](https://google.github.io/mediapipe/solutions/face_mesh.html)
- [Landmark Visualization](https://github.com/google/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model_uv_visualization.png)
- [WebGL Performance Tips](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

## ✅ Success Criteria

Your MediaPipe integration is working correctly if:
- ✅ Debug panel shows "🤖 MediaPipe"
- ✅ FPS counter is green (>25 FPS)
- ✅ Face count updates correctly
- ✅ Filters track face smoothly
- ✅ Captured photos include AR filters
- ✅ No console errors
- ✅ Works on mobile devices

---

**Happy Testing! 🎭✨**
