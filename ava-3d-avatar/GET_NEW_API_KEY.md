# 🔑 How to Get a New Eleven Labs API Key

## Current Issue
Your Eleven Labs API key has exhausted its free tier quota (10,000 characters/month).

**Current Key**: `598b439fd3c75dd7528dd0e0badaf7c8b89abae3804701e926da5bfd9402c416`

---

## Solution: Get a New Free API Key

### Step 1: Create New Account

1. **Visit Eleven Labs**:
   ```
   https://elevenlabs.io
   ```

2. **Sign Up**:
   - Click "Sign Up" or "Get Started"
   - Use a **different email address** (not the one currently used)
   - Or use Google/GitHub sign-in with different account

3. **Verify Email**:
   - Check your inbox
   - Click verification link

### Step 2: Get Your API Key

1. **Login** to your new account

2. **Navigate to Profile**:
   - Click your profile icon (top right corner)
   - Select **"Profile + API Key"**

3. **Copy API Key**:
   - You'll see your API key displayed
   - Click the copy button
   - It looks like: `sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 3: Update Your .env File

1. **Open** `ava-3d-avatar/apps/backend/.env`

2. **Replace** the old API key:

   **Find this line**:
   ```env
   ELEVEN_LABS_API_KEY=598b439fd3c75dd7528dd0e0badaf7c8b89abae3804701e926da5bfd9402c416
   ```

   **Replace with your new key**:
   ```env
   ELEVEN_LABS_API_KEY=sk_your_new_api_key_here
   ```

3. **Save** the file

### Step 4: Restart Backend Server

1. **Stop** the current backend (Ctrl+C in terminal)

2. **Start** it again:
   ```bash
   cd ava-3d-avatar/apps/backend
   node server.js
   ```

3. **Test** by sending a message from the frontend

---

## Alternative: Upgrade Current Account

If you want to keep your current account:

### Pricing Plans

**Free Tier**:
- 10,000 characters/month
- All voices
- Cost: $0

**Starter Plan**:
- 30,000 characters/month
- All voices
- Commercial use
- Cost: **$5/month**

**Creator Plan**:
- 100,000 characters/month
- Voice cloning
- Priority support
- Cost: **$22/month**

**Pro Plan**:
- 500,000 characters/month
- Advanced features
- Cost: **$99/month**

### To Upgrade:

1. Visit: https://elevenlabs.io/pricing
2. Choose a plan
3. Complete payment
4. Your current API key will work with new quota

---

## Quick Reference

### File to Edit
```
ava-3d-avatar/apps/backend/.env
```

### Line to Change
```env
ELEVEN_LABS_API_KEY=your_new_key_here
```

### After Changing
```bash
# Restart backend
cd ava-3d-avatar/apps/backend
node server.js
```

---

## Verification

After updating the API key:

1. **Open** `http://localhost:5174`
2. **Type** a message
3. **Press** SEND
4. **Listen** for audio (should work now!)

---

## Free Tier Limits

- **Characters**: 10,000/month
- **Resets**: Monthly (on signup date)
- **Voices**: All available
- **Quality**: Full quality

### Tips to Conserve Quota:

1. **Keep messages short** during testing
2. **Use text responses** for debugging
3. **Test voice** only when needed
4. **Monitor usage** in Eleven Labs dashboard

---

## Troubleshooting

### "Invalid API Key" Error
- Make sure you copied the entire key
- Check for extra spaces
- Verify key starts with `sk_`

### "Quota Still Exceeded"
- Wait 5 minutes after changing key
- Restart backend server
- Clear browser cache

### "No Audio Playing"
- Check browser console for errors
- Verify backend is running
- Test with short message first

---

## Need Help?

- **Eleven Labs Support**: https://elevenlabs.io/support
- **Documentation**: https://docs.elevenlabs.io
- **Discord**: https://discord.gg/elevenlabs

---

**Quick Start**: Create new account → Get API key → Update `.env` → Restart backend → Test! 🚀
