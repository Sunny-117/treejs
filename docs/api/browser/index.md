# @outilx/browser API

Browser utility functions for modern web development.

> **Note**: This package re-exports all utilities from `@outilx/core` for backward compatibility. For runtime-agnostic code, consider using `@outilx/core` directly.

## Modules

- [Network](/api/browser/network) - Network information using browser APIs
- [Storage](/api/browser/storage) - LocalStorage-based caching
- [Timer](/api/browser/timer) - Precise timer using Web Worker (not throttled in background tabs)

## Installation

```bash
npm install @outilx/browser
```

## Quick Example

```typescript
import { getNetWorkInfo, LocalStorageCache } from '@outilx/browser';

// Network info
const info = getNetWorkInfo();
// { status: 'online', type: '4g', rtt: 50, downlink: 10 }

// Persistent cache using LocalStorage
const storage = new LocalStorageCache('my_app_');
await storage.set('user', { name: 'John' });
```
