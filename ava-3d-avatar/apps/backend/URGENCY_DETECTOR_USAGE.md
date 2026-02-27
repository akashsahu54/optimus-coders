# Urgency Detector - Usage Guide

## Overview

The Urgency Detector module automatically identifies urgent customer issues and determines escalation priority using multi-factor analysis.

## Features

✅ **Multi-Factor Scoring**
- Urgency keywords (40% weight)
- Emotional intensity from sentiment (30% weight)
- Time-sensitive mentions (20% weight)
- Repeated contact patterns (10% weight)

✅ **4 Urgency Levels**
- **Critical** (score ≥ 0.8): Emergency situations requiring immediate attention
- **High** (score ≥ 0.6): Urgent issues that need quick resolution
- **Medium** (score ≥ 0.3): Moderate priority issues
- **Low** (score < 0.3): General inquiries

✅ **Automatic Escalation**
- Flags conversations requiring human agent escalation
- Provides escalation messages
- Assigns queue priority

## Installation

The module is already created at:
```
ava-3d-avatar/apps/backend/modules/urgencyDetector.mjs
```

No additional dependencies required - uses only Node.js built-ins.

## Basic Usage

```ja