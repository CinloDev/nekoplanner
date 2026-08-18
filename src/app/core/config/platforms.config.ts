import { Platform } from '../models';

export interface PlatformMeta {
  label: string;
  icon: string;
}

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  instagram: {
    label: 'Instagram',
    icon: '/assets/platforms/instagram.svg',
  },
  facebook: {
    label: 'Facebook',
    icon: '/assets/platforms/facebook.svg',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: '/assets/platforms/linkedin.svg',
  },
  tiktok: {
    label: 'TikTok',
    icon: '/assets/platforms/tiktok.svg',
  },
  x: {
    label: 'X',
    icon: '/assets/platforms/x.svg',
  },
  youtube: {
    label: 'YouTube',
    icon: '/assets/platforms/youtube.svg',
  },
};
