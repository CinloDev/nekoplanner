import { Platform } from './platform.model';
import { PostStatus } from './post-status.model';

export interface PlatformDistribution {
  platform: Platform;
  count: number;
  percentage: number;
}

export interface StatusDistribution {
  status: PostStatus;
  count: number;
  percentage: number;
}
