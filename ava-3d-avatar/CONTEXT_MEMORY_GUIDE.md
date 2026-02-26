# 🧠 Context, State & Memory Management Guide

## Overview

Aapke voice-to-voice agent mein ab **complete context awareness** aur **efficient memory management** hai!

## 🎯 Key Features

### 1. Conversation Memory
- ✅ Multi-turn conversations with context
- ✅ Remembers previous messages
- ✅ Natural conversation flow
- ✅ Session-based isolation

### 2. Session Management
- ✅ Unique session per user
- ✅ Auto-cleanup of inactive sessions
- ✅ Session statistics tracking
- ✅ Persistent session IDs

### 3. Memory Management
- ✅ Efficient audio buffer management
- ✅ Automatic garbage collection
- ✅ Memory usage monitoring
- ✅ LRU cache eviction

### 4. State Management
- ✅ Smooth state transitions
- ✅ Request tracking
- ✅ Activity monitoring
- ✅ Graceful cleanup

## 📦 New Modules

### Backend Modules

#### 1. `contextualAI.mjs`
```javascript
import { chatWithContext } from "./modules/contextualAI.mjs";

// Chat with conversation context
const response = await chatWithContext(userMessage, sessionId);
```

**Features:**
- Maintains conversation history
- Context-aware responses
- Natural conversation flow
- Automatic history management

#### 2. `conversationMemory.mjs`
```javascript
import { conversationMemory } from "./modules/conversationMemory.mjs";

// Add message
conversationMemory.addMessage(sessionId, "user", "Hello");

// Get history
const history = conversationMemory.getHistory(sessionId, 5);

// Clear session
conversationMemory.clearSession(sessionId);
```

**Features:**
- Stores last 10 messages per session
- 30-minute session TTL
- Automatic cleanup
- Context data storage

#### 3. `memoryManager.mjs`
```javascript
import { memoryManager } from "./modules/memoryManager.mjs";

// Store audio buffer
const id = memoryManager.storeAudioBuffer(id, buffer, ttl);

// Get stats
const stats = memoryManager.getStats();

// Clear memory
memoryManager.clearAll();
```

**Features:**
- 100MB memory limit
- LRU eviction
- Auto-cleanup
- Memory monitoring

#### 4. `sessionManager.mjs`
```javascript
import { sessionManager } from "./modules/sessionManager.mjs";

// Create session
const session = sessionManager.getOrCreateSession(userId);

// Get stats
const stats = sessionManager.getSessionStats(sessionId);

// End session
sessionManager.endSession(sessionId);
```

**Features:**
- Session lifecycle management
- Activity tracking
- Auto-timeout (30 minutes)
- Statistics collection

### Frontend Hooks

#### 1. `useSession.jsx`
```javascript
import { useSession } from "./hooks/useSession";

const {
  sessionId,
  conversationHistory,
  sessionStats,
  clearConversation,
  refreshStats,
} = useSession();
```

**Features:**
- Persistent session IDs
- Local storage integration
- Conversation history
- Stats tracking

#### 2. Updated `useFastVoice.jsx`
```javascript
import { useFastVoice } from "./hooks/useFastVoice";

const {
  sessionId,
  conversationHistory,
  sessionStats,
  clearConversation,
  // ... other features
} = useFastVoice();
```

**New Features:**
- Session-aware requests
- Context preservation
- History tracking
- Stats display

### Frontend Components

#### `SessionDashboard.jsx`
```javascript
import { SessionDashboard } from "./components/SessionDashboard";

<SessionDashboard 
  sessionId={sessionId}
  sessionStats={sessionStats}
/>
```

**Features:**
- Real-time session info
- Memory usage display
- Conversation history
- Interactive controls

## 🚀 API Endpoints

### Session Management

#### Get Conversation History
```http
GET /conversation/:sessionId

Response:
{
  "sessionId": "abc123",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ],
  "stats": {
    "messageCount": 2,
    "duration": 45000
  }
}
```

#### Clear Conversation
```http
DELETE /conversation/:sessionId

Response:
{
  "success": true,
  "message": "Conversation cleared"
}
```

#### Get Session Stats
```http
GET /session/:sessionId/stats

Response:
{
  "sessionId": "abc123",
  "duration": 120,
  "requestCount": 5,
  "state": "active",
  "conversationMessages": 10,
  "memoryUsageMB": "12.45"
}
```

#### Get All Sessions
```http
GET /sessions

Response:
{
  "totalSessions": 3,
  "sessions": [...],
  "memoryStats": {...}
}
```

### Memory Management

#### Get Memory Stats
```http
GET /memory/stats

Response:
{
  "stats": {
    "currentUsageMB": 12.45,
    "peakUsageMB": 25.67,
    "usagePercent": 12.45,
    "audioBufferCount": 5,
    "tempDataCount": 3
  },
  "report": "..."
}
```

#### Clear Memory
```http
POST /memory/clear

Response:
{
  "success": true,
  "message": "Memory cleared"
}
```

## 💡 Usage Examples

### Example 1: Contextual Conversation

```javascript
// User: "What's the weather?"
// AVA: "I can help with that! Which city?"

// User: "New York" (context aware - knows we're talking about weather)
// AVA: "The weather in New York is sunny, 72°F"

// User: "What about tomorrow?" (context aware - still talking about NY weather)
// AVA: "Tomorrow in New York will be partly cloudy, 68°F"
```

### Example 2: Session Persistence

```javascript
// First visit
const session1 = sessionManager.getOrCreateSession("user123");
// sessionId: "abc123"

// User leaves and comes back
const session2 = sessionManager.getOrCreateSession("user123");
// sessionId: "abc123" (same session!)

// Conversation continues from where it left off
```

### Example 3: Memory Management

```javascript
// Store audio buffer
const audioId = memoryManager.storeAudioBuffer(
  "audio_123",
  buffer,
  60000 // 1 minute TTL
);

// Buffer automatically cleaned up after 1 minute
// Or when memory limit reached (LRU eviction)
```

## 📊 Performance Impact

### Memory Usage
```
Before: Unmanaged (potential memory leaks)
After:  Controlled (100MB limit with auto-cleanup)
```

### Context Awareness
```
Before: No context (each query independent)
After:  Full context (natural conversations)
```

### Session Management
```
Before: No sessions (stateless)
After:  Session-based (stateful with auto-cleanup)
```

## 🔧 Configuration

### Conversation Memory
```javascript
// In conversationMemory.mjs
const memory = new ConversationMemory({
  maxMessages: 10,        // Max messages per session
  sessionTTL: 1800000,    // 30 minutes
  maxTokens: 2000,        // Token limit
});
```

### Memory Manager
```javascript
// In memoryManager.mjs
const manager = new MemoryManager({
  maxMemoryMB: 100,       // 100MB limit
});
```

### Session Manager
```javascript
// In sessionManager.mjs
const manager = new SessionManager();
manager.sessionTimeout = 1800000; // 30 minutes
```

## 🎨 Frontend Integration

### Basic Usage
```jsx
import { useFastVoice } from "./hooks/useFastVoice";
import { SessionDashboard } from "./components/SessionDashboard";

function App() {
  const {
    sessionId,
    sessionStats,
    conversationHistory,
    clearConversation,
    // ... other features
  } = useFastVoice();

  return (
    <>
      {/* Your UI */}
      
      <SessionDashboard 
        sessionId={sessionId}
        sessionStats={sessionStats}
      />
      
      <button onClick={clearConversation}>
        Clear Conversation
      </button>
    </>
  );
}
```

### Advanced Usage
```jsx
// Monitor conversation
useEffect(() => {
  console.log("Conversation history:", conversationHistory);
  console.log("Session stats:", sessionStats);
}, [conversationHistory, sessionStats]);

// Clear on logout
const handleLogout = () => {
  clearConversation();
  // ... other logout logic
};
```

## 🐛 Troubleshooting

### Issue: Context not working
**Solution:**
1. Check sessionId is being sent in requests
2. Verify conversationMemory is storing messages
3. Check AI prompt includes context

### Issue: High memory usage
**Solution:**
1. Check memory stats: `GET /memory/stats`
2. Clear old buffers: `POST /memory/clear`
3. Reduce maxMemoryMB in config

### Issue: Sessions not persisting
**Solution:**
1. Check localStorage for session ID
2. Verify session timeout settings
3. Check backend session cleanup

## 📈 Monitoring

### Backend Logs
```bash
# Watch for these messages:
🆕 New session created: abc123
🧹 Cleaned 2 expired sessions
🧹 Freed 15.23MB of audio buffers
⚠️  High memory usage: 85.45MB / 100MB
```

### Frontend Console
```javascript
// Session info
console.log("Session ID:", sessionId);
console.log("Messages:", conversationHistory.length);
console.log("Stats:", sessionStats);
```

### Dashboard
- Open Session Dashboard (bottom-right button)
- Monitor real-time stats
- View conversation history
- Check memory usage

## 🎯 Best Practices

1. **Clear conversations** when user logs out
2. **Monitor memory** regularly in production
3. **Adjust TTLs** based on usage patterns
4. **Use session IDs** for user identification
5. **Handle errors** gracefully
6. **Log important events** for debugging

## 🚀 Next Steps

1. ✅ Test contextual conversations
2. ✅ Monitor memory usage
3. ✅ Adjust configuration as needed
4. ✅ Add persistence (database) if needed
5. ✅ Implement user authentication
6. ✅ Add analytics tracking

## 📝 Summary

Your voice agent now has:
- ✅ **Context awareness** - Natural conversations
- ✅ **Session management** - Stateful interactions
- ✅ **Memory management** - Efficient resource usage
- ✅ **State management** - Smooth transitions
- ✅ **Monitoring** - Real-time insights

**Result:** Smooth, fast, and intelligent conversations! 🎉

---

Made with ❤️ for contextual, efficient voice interactions
