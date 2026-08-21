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

export interface PostFormData {
  title: string;
  content: string;
  platform: Platform;
  status: PostStatus;
  scheduledDate?: string;
  tags?: Post['tags'];
  media?: Post['media'];
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

export function updatePostFromForm(post: Post, formValue: PostFormData): Post {
  return {
    ...post,
    title: formValue.title,
    content: formValue.content,
    platform: formValue.platform,
    status: formValue.status,
    scheduledDate: formValue.scheduledDate,
    tags: formValue.tags || post.tags || [],
    media: formValue.media || post.media || [],
    updatedAt: new Date().toISOString()
  };
}
