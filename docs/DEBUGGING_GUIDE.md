# DEBUGGING GUIDE - Stories & Posts Issues

## Current Issues Reported
1. ❌ Stories don't open when clicked
2. ❌ Can't add music/audio to stories
3. ❌ Posts don't show in feed
4. ❌ Posts don't show on profile page
5. ❌ Post count not updating

## Step-by-Step Debugging Process

### STEP 1: Restart Backend Server

The backend code has been updated. You MUST restart it to pick up changes.

```powershell
# In backend terminal (Ctrl+C to stop, then run):
npm run start:dev
```

### STEP 2: Check if Backend is Running

```powershell
# Test basic endpoint
curl http://localhost:3000
```

Should return: `{"message":"Femo Space API is running"}`

---

### STEP 3: Test Post Creation

#### A. Get Your Auth Token
1. Login to the app at `http://localhost:5173`
2. Open Browser DevTools (F12)
3. Go to Application → Cookies
4. Copy the `access_token` value

#### B. Test Post Endpoint

```powershell
# Replace YOUR_TOKEN with actual token
$token = "YOUR_TOKEN_HERE"

curl -X POST http://localhost:3000/posts `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{
    "ownerType": "user",
    "ownerId": "YOUR_USER_ID",
    "type": "text",
    "content": "Test post from debugging",
    "visibility": "public",
    "status": "published"
  }'
```

**Expected**: Should return the created post object with `_id`

**If Error**: Check console for:
- 401: Token expired, login again
- 403: OwnerId doesn't match your userId
- 500: Database connection issue

---

### STEP 4: Test Posts Feed

```powershell
curl -X GET http://localhost:3000/posts/feed `
  -H "Authorization: Bearer $token"
```

**Expected**: Array of post objects with populated `ownerId` containing user data

**If Empty**: 
- No posts are marked as `status: 'published'`
- Check database directly

---

### STEP 5: Test Story Upload

#### A. Test File Upload First

```powershell
# Upload a test image
curl -X POST http://localhost:3000/upload/file `
  -H "Authorization: Bearer $token" `
  -F "file=@C:\path\to\your\image.jpg"
```

**Expected**: Returns `{ url: "http://localhost:3000/uploads/XXXXX.jpg", ... }`

**If Error**:
- Check if `backend/uploads` folder exists
- Check file permissions

#### B. Create Story with Uploaded Media

```powershell
curl -X POST http://localhost:3000/stories `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{
    "ownerType": "user",
    "ownerId": "YOUR_USER_ID",
    "type": "image",
    "media": {
      "url": "http://localhost:3000/uploads/XXXXX.jpg",
      "type": "image",
      "duration": 5
    },
    "content": {},
    "audience": "public"
  }'
```

**Expected**: Returns created story with `_id` and `expiresAt`

---

### STEP 6: Test Stories Feed

```powershell
curl -X GET http://localhost:3000/stories/feed `
  -H "Authorization: Bearer $token"
```

**Expected**: Array of story groups, each with:
- `owner`: User object with profile data
- `stories`: Array of story objects
- `hasUnseen`: boolean

---

### STEP 7: Test Profile Posts Endpoint

```powershell
curl -X GET "http://localhost:3000/posts/by/user/YOUR_USER_ID" `
  -H "Authorization: Bearer $token"
```

**Expected**: Array of YOUR posts only

**If 404**: Route not registered - backend wasn't restarted

---

### STEP 8: Test Profile Stories Endpoint

```powershell
curl -X GET "http://localhost:3000/stories/by/user/YOUR_USER_ID" `
  -H "Authorization: Bearer $token"
```

**Expected**: Array of YOUR active stories

**If 404**: Route not registered - backend wasn't restarted

---

## Frontend Debugging

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Try creating a post or story
4. Look for errors:

**Common Errors**:
```
POST /posts 401 Unauthorized
→ Token expired, refresh page and login again

POST /upload/file 500 Internal Server Error
→ Backend can't write to uploads folder

GET /posts/feed returns []
→ No published posts in database
```

### Check Network Tab

1. Open DevTools (F12) → Network tab
2. Filter: `Fetch/XHR`
3. Try clicking a story
4. Look for the request:
   - `GET /stories/feed` - should return 200
   - Check response - should have data

### Story Click Not Working

If stories don't open when clicked:

**Check StoryBar Component**:
```javascript
// In web-app/src/components/stories/StoryBar.tsx
// Line 65 should have:
onClick={() => onStoryClick(owner._id)}
```

**Check Home Component**:
```javascript
// In web-app/src/pages/Home.tsx
// Line 14 should have state:
const [viewingOwnerId, setViewingOwnerId] = useState<string | null>(null);

// Line 91 should pass callback:
<StoryBar onStoryClick={setViewingOwnerId} />
```

---

## Database Checks

### Check MongoDB is Running

```powershell
# In a new terminal
mongosh mongodb://127.0.0.1:27017/femo-space
```

### Query Posts

```javascript
db.posts.find({ visibility: 'public', status: 'published' }).pretty()
```

### Query Stories

```javascript
db.stories.find({ expiresAt: { $gt: new Date() }, isArchived: false }).pretty()
```

### Check User Profile

```javascript
db.users.findOne({ username: "YOUR_USERNAME" })
```

---

## Common Fixes

### Fix 1: Posts Not Showing - Missing User ID

**Problem**: `ownerId` is null or incorrect

**Solution**: Check PostComposer.tsx line 64:
```typescript
ownerId: (user as any)?._id || (user as any)?.id,
```

Make sure AuthContext is providing user with `_id` field.

### Fix 2: Stories Not Opening - Missing Owner ID

**Problem**: StoryViewer doesn't get ownerId

**Solution**: In Home.tsx, ensure:
```typescript
<StoryBar onStoryClick={setViewingOwnerId} />
```

And:
```typescript
  {viewingOwnerId && (
    <StoryViewer
      ownerId={viewingOwnerId}
      onClose={() => setViewingOwnerId(null)}
    />
  )}
```

### Fix 3: Audio Not Showing in Story Composer

**Status**: ✅ Already fixed
- File input accepts: `image/*,video/*,audio/*`
- Backend upload endpoint accepts all MIME types
- No UI blocker

**To Verify**: 
- Click "+" in Story Bar
- Click "CHOOSE MEDIA"
- File picker should show "All Files" or "Custom Files"
- Select an MP3 file
- Should upload successfully

### Fix 4: Profile Route Conflict

**Status**: ✅ Already fixed
- `/profile/edit` moved before `/profile/:username` in routes
- Prevents "edit" being treated as username

---

## Testing Checklist

After restarting backend, test in order:

- [ ] Backend responds at `http://localhost:3000`
- [ ] Login works and token is saved
- [ ] File upload works (`POST /upload/file`)
- [ ] Create post works (`POST /posts`)
- [ ] Posts feed loads (`GET /posts/feed`)
- [ ] Profile posts load (`GET /posts/by/user/:userId`)
- [ ] Create story works (`POST /stories`)
- [ ] Stories feed loads (`GET /stories/feed`)
- [ ] Profile stories load (`GET /stories/by/user/:userId`)
- [ ] Click story → opens viewer
- [ ] Click profile icon → goes to profile
- [ ] Profile page shows Posts tab
- [ ] Profile page shows Stories tab

---

## If Still Not Working

### Check These Files Were Modified

Backend:
```
✓ backend/src/posts/posts.controller.ts
✓ backend/src/posts/posts.service.ts
✓ backend/src/stories/stories.controller.ts
✓ backend/src/stories/stories.service.ts
```

Frontend:
```
✓ web-app/src/App.tsx (route order)
✓ web-app/src/pages/Profile.tsx (Stories tab, @ handling)
✓ web-app/src/components/stories/StoryComposer.tsx (audio support)
```

### Get Full Error Details

1. Open DevTools Console
2. Click "Preserve log"
3. Reproduce the issue
4. Right-click the error → "Save as"
5. Share the error log

---

## Quick Test Commands

```powershell
# 1. Check if backend is running
curl http://localhost:3000

# 2. Check if MongoDB is connected
curl http://localhost:3000/health

# 3. Test authentication (after login)
$token = "YOUR_TOKEN"
curl http://localhost:3000/posts/feed -H "Authorization: Bearer $token"

# 4. Test new routes
curl http://localhost:3000/posts/by/user/YOUR_ID -H "Authorization: Bearer $token"
curl http://localhost:3000/stories/by/user/YOUR_ID -H "Authorization: Bearer $token"
```

---

## Expected Behavior After Fixes

✅ **Home Page**:
- Story bar shows user profile photos
- Click "+" → upload image/video/audio
- Add text/emoji/effects
- Post → appears in Story bar
- Click story → opens fullscreen viewer

✅ **Posts**:
- Type in composer → add media → Post
- Appears in feed immediately
- Shows user profile photo
- Click profile photo → goes to profile

✅ **Profile Page**:
- Has "Posts" and "Stories" tabs
- Posts tab shows all user posts
- Stories tab shows active stories (24h)
- Post count increments when posting

---

*Last Updated: 2026-01-29 11:18*
