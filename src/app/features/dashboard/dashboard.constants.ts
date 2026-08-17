import { Platform } from '../../core/models';

export interface PlatformMeta {
  label: string;
  color: string;
}

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  instagram: { label: 'Instagram', color: '#E1306C' },
  facebook: { label: 'Facebook', color: '#1877F2' },
  x: { label: 'X', color: 'var(--color-text-main)' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2' },
  tiktok: { label: 'TikTok', color: '#00f2fe' },
  youtube: { label: 'YouTube', color: '#FF0000' },
};
