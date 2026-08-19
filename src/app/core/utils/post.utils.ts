import { Post, Platform, PostStatus } from '../models';

export interface PostCreationParams {
  title: string;
  content: string;
  platform: Platform;
  status: PostStatus;
  scheduledDate?: string;
  tags?: any[];
  media?: any[];
}

export function createNewPost(params: PostCreationParams): Post {
  const now = new Date().toISOString();
  
  return {
    id: crypto.randomUUID(),
    title: params.title,
    content: params.content,
    platform: params.platform,
    status: params.status,
    scheduledDate: params.scheduledDate,
    tags: params.tags || [],
    media: params.media || [],
    createdAt: now,
    updatedAt: now
  };
}
