/**
 * Memory Manager
 * Efficient memory management for audio buffers and cached data
 */
class MemoryManager {
  constructor(options = {}) {
    this.maxMemoryMB = options.maxMemoryMB || 100; // 100MB default
    this.audioBuffers = new Map();
    this.tempData = new Map();
    this.stats = {
      allocations: 0,
      deallocations: 0,
      currentUsageMB: 0,
      peakUsageMB: 0,
    };

    // Monitor memory every 30 seconds
    setInterval(() => this.checkMemory(), 30000);
  }

  /**
   * Store audio buffer with automatic cleanup
   */
  storeAudioBuffer(id, buffer, ttl = 300000) {
    const sizeMB = buffer.length / (1024 * 1024);
    
    // Check if we need to free memory
    if (this.stats.currentUsageMB + sizeMB > this.maxMemoryMB) {
      this.freeOldestBuffers(sizeMB);
    }

    this.audioBuffers.set(id, {
      buffer,
      timestamp: Date.now(),
      ttl,
      sizeMB,
    });

    this.stats.allocations++;
    this.stats.currentUsageMB += sizeMB;
    
    if (this.stats.currentUsageMB > this.stats.peakUsageMB) {
      this.stats.peakUsageMB = this.stats.currentUsageMB;
    }

    // Auto-cleanup after TTL
    setTimeout(() => this.releaseAudioBuffer(id), ttl);

    return id;
  }

  /**
   * Get audio buffer
   */
  getAudioBuffer(id) {
    const entry = this.audioBuffers.get(id);
    return entry?.buffer || null;
  }

  /**
   * Release audio buffer
   */
  releaseAudioBuffer(id) {
    const entry = this.audioBuffers.get(id);
    if (entry) {
      this.stats.currentUsageMB -= entry.sizeMB;
      this.stats.deallocations++;
      this.audioBuffers.delete(id);
    }
  }

  /**
   * Free oldest buffers to make space
   */
  freeOldestBuffers(requiredMB) {
    const entries = Array.from(this.audioBuffers.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    let freedMB = 0;
    for (const [id, entry] of entries) {
      if (freedMB >= requiredMB) break;
      this.releaseAudioBuffer(id);
      freedMB += entry.sizeMB;
    }

    console.log(`🧹 Freed ${freedMB.toFixed(2)}MB of audio buffers`);
  }

  /**
   * Store temporary data
   */
  storeTempData(key, data, ttl = 60000) {
    this.tempData.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Auto-cleanup
    setTimeout(() => this.tempData.delete(key), ttl);
  }

  /**
   * Get temporary data
   */
  getTempData(key) {
    const entry = this.tempData.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.tempData.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check memory usage and cleanup if needed
   */
  checkMemory() {
    const now = Date.now();

    // Cleanup expired audio buffers
    for (const [id, entry] of this.audioBuffers.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.releaseAudioBuffer(id);
      }
    }

    // Cleanup expired temp data
    for (const [key, entry] of this.tempData.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.tempData.delete(key);
      }
    }

    // Log if memory usage is high
    if (this.stats.currentUsageMB > this.maxMemoryMB * 0.8) {
      console.warn(
        `⚠️  High memory usage: ${this.stats.currentUsageMB.toFixed(2)}MB / ${this.maxMemoryMB}MB`
      );
    }
  }

  /**
   * Get memory statistics
   */
  getStats() {
    return {
      ...this.stats,
      audioBufferCount: this.audioBuffers.size,
      tempDataCount: this.tempData.size,
      usagePercent: (this.stats.currentUsageMB / this.maxMemoryMB) * 100,
    };
  }

  /**
   * Force garbage collection (if available)
   */
  forceGC() {
    if (global.gc) {
      global.gc();
      console.log("🗑️  Forced garbage collection");
    }
  }

  /**
   * Clear all memory
   */
  clearAll() {
    this.audioBuffers.clear();
    this.tempData.clear();
    this.stats.currentUsageMB = 0;
    console.log("🧹 Cleared all memory");
  }

  /**
   * Get memory usage report
   */
  getReport() {
    const stats = this.getStats();
    
    return `
Memory Manager Report:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Usage:    ${stats.currentUsageMB.toFixed(2)}MB (${stats.usagePercent.toFixed(1)}%)
Peak Usage:       ${stats.peakUsageMB.toFixed(2)}MB
Max Allowed:      ${this.maxMemoryMB}MB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Audio Buffers:    ${stats.audioBufferCount}
Temp Data:        ${stats.tempDataCount}
Allocations:      ${stats.allocations}
Deallocations:    ${stats.deallocations}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  }
}

// Singleton instance
export const memoryManager = new MemoryManager({
  maxMemoryMB: 100, // 100MB limit
});

export default MemoryManager;
