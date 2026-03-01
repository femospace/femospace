# Quick Reference - Story & Post Features

## Story Posting Guide

### What You Can Post
✅ **Photos** - JPG, PNG, WebP
✅ **Videos** - MP4, WebM, MOV  
✅ **Audio** - MP3, WAV, OGG (music snippets, voice notes)
✅ **Text Overlays** - Type and drag anywhere on your story
✅ **Emojis** - 10 quick emojis + drag to position
✅ **Visual Effects** - 6 filters (Original, Vintage, B&W, Warm, Frost, Dreamy)

### How to Create a Story
1. Go to Home page
2. Click the "+" button in Story Bar (left side)
3. Choose a media file (photo/video/audio)
4. **Optional**: Add text, emojis, or effects
   - 🔤 Text: Click Type icon → type → drag to position → Add Text
   - 😊 Emoji: Click Smile icon → tap emoji → it appears centered
   - ✨ Effects: Click Sparkles icon → choose a filter
5. Click "Post to Space"
6. Your story appears in the Story Bar with your profile photo
7. **Auto-expires after 24 hours**

---

## Profile Features

### Viewing Your Profile
- Click Menu → Your Profile
- Or navigate to `/profile` or `/profile/YOUR_USERNAME`

### Profile Tabs
- **Posts** - All your published posts
- **Stories** - Your active stories (last 24 hours)
- **Videos** - Video content
- **Reels** - Short-form videos
- **Saved** - Your bookmarked content (own profile only)

### Story Grid
Stories appear as small vertical cards showing:
- Thumbnail of the media
- Date Posted
- Hover to scale up
- Click to view full screen

---

## Viewing Stories

### Story Bar (Home Page)
- **Your Space**: Create new story
- **Friends' Stories**: Gradient ring = unseen, Gray ring = seen
- Click any story to open fullscreen viewer

### Story Viewer Controls
- **Tap Left**: Previous story
- **Tap Right**: Next story / Auto-advances
- **Hold**: Pause progression
- **X Button**: Close viewer
- **Send Message**: Reply to story
- **Heart**: React with ❤️

### Story Progress
- Progress bars at top show which stories you've seen
- Auto-progresses every 5-15 seconds (based on media type)
- Closes automatically after last story

---

## Post Features

### Creating Posts
1. Home page → "What's on your mind?" composer
2. Type your content
3. **Optional**: Add media, hashtags
4. Choose visibility (Public/Friends/Private)
5. Click "Post"

### Viewing Posts on Profile
- Navigate to any user's profile
- Posts tab shows all their published posts
- Newest → Oldest order
- Full post cards with:
  - Profile photo (clickable → goes to profile)
  - Username (clickable → goes to profile)
  - Timestamp
  - Content + Media
  - Like, Comment, Share buttons

---

## Profile Navigation

### From Posts
Click the **profile photo** or **username** in any post → goes to that user's profile

### From Stories
Click the **profile photo** in story viewer header → goes to that user's profile

### Direct URL
- `/profile/USERNAME` - View specific user (NO @ symbol needed)
- `/profile/@USERNAME` - Also works (@ automatically stripped)
- `/profile` - Your own profile

---

## Technical Notes

### Story Lifecycle
1. **Created**: Story uploaded with expiresAt = now + 24h
2. **Active**: Visible in Story Bar and Feed (expires_at > now)
3. **Expired**: Automatically filtered out after 24h
4. **Archived**: Optionally save to highlights (future feature)

### Media Handling
- **Images**: Displayed as-is with applied filters
- **Videos**: Auto-play, muted, looping
- **Audio**: Preview icon (full playback in viewer)

### Privacy
- **Public**: Everyone can see
- **Followers**: Only your followers
- **Friends**: Only friends can see
- **Private**: Only you

---

## Troubleshooting

**Profile not found?**
- Check if username is correct (no @ needed in URL)
- Refresh the page
- Clear cache and reload

**Stories not showing?**
- They may have expired (24h limit)
- Check the Stories tab on profile for active ones
- Ensure you've uploaded at least one story

**Can't upload media?**
- Check file size (max: backend configured limit)
- Supported formats: image/*, video/*, audio/*
- Clear browser cache if stuck

**Profile photo not showing?**
- Ensure profile setup was completed
- Check Settings → Edit Profile → Upload Avatar
- Fallback avatar automatically generated if none set

---

## Keyboard Shortcuts (Story Viewer)
- `←` Left Arrow: Previous story
- `→` Right Arrow: Next story
- `Space`: Pause/Resume
- `Esc`: Close viewer

---

## Best Practices

✅ **DO**:
- Post engaging visual content
- Use text overlays for context
- Apply subtle effects for mood
- Keep audio short (< 15 seconds)
- Post regularly (keeps you in Story Bar)

❌ **DON'T**:
- Upload extremely large files
- Use too many overlays (cluttered)
- Post sensitive content publicly
- Spam stories (quality > quantity)

---

*Happy Posting! 🚀*
