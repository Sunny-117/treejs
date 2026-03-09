// Re-export all utilities from @outilx/core for backward compatibility
export * from '@outilx/core'

// Browser-specific exports
export * from './network'
export { LocalStorageCache } from './storage'
export { createPreciseTimer } from './timer'
