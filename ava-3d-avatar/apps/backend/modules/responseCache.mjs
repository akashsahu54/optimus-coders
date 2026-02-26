import crypto from "crypto";

/**
 * In-memory cache for fast responses
 * Common queries ke liye instant response
 */
class ResponseCache {
  constructor(maxSize = 100, ttl = 3600000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl; // 1 hour default
  }

  generateKey(text) {
    return crypto.createHash("md5").update(text.toLowerCase().trim()).digest("hex");
  }

  set(text, response) {
    const key = this.generateKey(text);
    
    // LRU eviction
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  get(text) {
    const key = this.generateKey(text);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check TTL
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.response;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const responseCache = new ResponseCache();
