export const STORAGE_NAMESPACE = 'nekoplanner:';

export const StorageKeys = {
  POSTS: `${STORAGE_NAMESPACE}posts`,
  IDEAS: `${STORAGE_NAMESPACE}ideas`,
  SETTINGS: `${STORAGE_NAMESPACE}settings`
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
