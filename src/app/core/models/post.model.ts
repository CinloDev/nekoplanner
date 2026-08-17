import { Platform } from './platform.model';
import { PostStatus } from './post-status.model';
import { Media } from './media.model';
import { Tag } from './tag.model';

export interface Post {
  id: string;
  title: string;
  content: string; // Caption
  scheduledDate?: string; // ISO date string
  platform: Platform;
  status: PostStatus;
  media?: Media[];
  tags?: Tag[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
