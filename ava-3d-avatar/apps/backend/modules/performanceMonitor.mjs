/**
 * Performance monitoring utility
 * Track karo ki har step mein kitna time lag raha hai
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.history = [];
  }

  start(label) {
    this.metrics.set(label, {
      startTime: Date.now(),
      endTime: null,
      duration: null,
    });
  }

  end(label) {
    const metric = this.metrics.get(label);
    if (!metric) {
      console.warn(`⚠️  Metric "${label}" not found`);
      return null;
    }

    metric.endTime = Date.now();
    metric.duration = metric.endTime - metric.startTime;

    this.history.push({
      label,
      duration: metric.duration,
      timestamp: metric.endTime,
    });

    return metric.duration;
  }

  get(label) {
    const metric = this.metrics.get(label);
    return metric?.duration || null;
  }

  getAll() {
    const results = {};
    for (const [label, metric] of this.metrics.entries()) {
      results[label] = metric.duration;
    }
    return results;
  }

  getSummary() {
    const all = this.getAll();
    const total = Object.values(all).reduce((sum, val) => sum + (val || 0), 0);
    
    return {
      metrics: all,
      total,
      breakdown: Object.entries(all).map(([label, duration]) => ({
        label,
        duration,
        percentage: total > 0 ? ((duration / total) * 100).toFixed(1) : 0,
      })),
    };
  }

  log() {
    const summary = this.getSummary();
    
    console.log("\n" + "=".repeat(60));
    console.log("⚡ PERFORMANCE METRICS");
    console.log("=".repeat(60));
    
    summary.breakdown.forEach(({ label, duration, percentage }) => {
      const bar = "█".repeat(Math.floor(percentage / 2));
      console.log(`${label.padEnd(25)} ${duration}ms ${bar} ${percentage}%`);
    });
    
    console.log("-".repeat(60));
    console.log(`TOTAL: ${summary.total}ms`);
    console.log("=".repeat(60) + "\n");
  }

  reset() {
    this.metrics.clear();
  }

  getHistory(limit = 10) {
    return this.history.slice(-limit);
  }

  getAverages() {
    const labelGroups = {};
    
    this.history.forEach(({ label, duration }) => {
      if (!labelGroups[label]) {
        labelGroups[label] = [];
      }
      labelGroups[label].push(duration);
    });

    const averages = {};
    for (const [label, durations] of Object.entries(labelGroups)) {
      const sum = durations.reduce((a, b) => a + b, 0);
      averages[label] = Math.round(sum / durations.length);
    }

    return averages;
  }
}

/**
 * Middleware for Express to track request performance
 */
export const performanceMiddleware = (req, res, next) => {
  const monitor = new PerformanceMonitor();
  req.perfMonitor = monitor;
  
  monitor.start("total_request");
  
  // Override res.send to capture end time
  const originalSend = res.send;
  res.send = function (data) {
    monitor.end("total_request");
    monitor.log();
    originalSend.call(this, data);
  };
  
  next();
};

export default PerformanceMonitor;
